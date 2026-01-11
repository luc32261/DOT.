from flask import Blueprint, jsonify, request
from models import db, Store, Product, Inventory, TransferRecommendation, ManagerFeedback, StoreDNA
from models import stores_schema, transfers_schema
from logic import optimize_transfers, smart_order_routing
from models import product_schema, products_schema

api_bp = Blueprint('api', __name__)

@api_bp.route('/stores', methods=['GET'])
def get_stores():
    stores = Store.query.all()
    return jsonify(stores_schema.dump(stores))

@api_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    # 1. Update DNA for all stores (Analyze latest sales data)
    stores = Store.query.all()
    from logic import generate_store_dna # Import here to avoid circular if logic imports models
    for store in stores:
        generate_store_dna(store.id)
        
    # 2. Generate Recommendations based on new DNA
    # Clear old pending to avoid duplicates for the demo (fresh start each refresh)
    # db.session.query(TransferRecommendation).filter_by(status='Pending').delete()
    # db.session.commit()
    
    # Only run optimization if we have no recommendations (Persist Seed Data)
    if TransferRecommendation.query.count() == 0:
        optimize_transfers()
    
    recs = TransferRecommendation.query.all()
    return jsonify(transfers_schema.dump(recs))

@api_bp.route('/feedback', methods=['POST'])
def add_feedback():
    data = request.json
    feedback = ManagerFeedback(
        store_id=data['store_id'],
        product_id=data['product_id'],
        comment=data.get('comment'),
        feedback_type=data['feedback_type']
    )
    db.session.add(feedback)
    db.session.commit()
    return jsonify({"message": "Feedback received"}), 201

@api_bp.route('/products', methods=['GET'])
def get_products():
    # Only return products that have at least one inventory item with velocity < 2 (Dead Stock)
    # AND quantity > 0
    # Show all available products regardless of velocity
    products = db.session.query(Product).join(Inventory).filter(
        Inventory.quantity > 0
    ).distinct().all()
    
    return jsonify(products_schema.dump(products))

@api_bp.route('/purchase', methods=['POST'])
def purchase_product():
    data = request.json
    # Expect: { "customer_lat": float, "customer_lon": float, "product_id": int, "quantity": int }
    
    # Default location (Central Park NY) if not provided for demo
    lat = data.get('customer_lat', 40.785091)
    lon = data.get('customer_lon', -73.968285)
    
    result, status = smart_order_routing(
        customer_lat=lat,
        customer_lon=lon,
        product_id=data['product_id'],
        quantity=data.get('quantity', 1)
    )
    
    if not result:
        return jsonify({"message": status}), 400
        
    return jsonify({
        "message": "Order Placed Successfully",
        "fulfillment_details": result
    }), 200

@api_bp.route('/inventory/all', methods=['GET'])
def get_all_inventory():
    # Return all inventory joined with Product and Store
    inventory = Inventory.query.join(Product).join(Store).all()
    
    # Custom dump because Schema might be too nested or circular
    results = []
    for i in inventory:
        results.append({
            "id": i.id,
            "product_name": i.product.name,
            "product_image": i.product.image_url,
            "store_name": i.store.name,
            "quantity": i.quantity,
            "status": "Dead Stock" if i.weekly_sales_velocity < 2 else "Healthy", # Simple logic
            "sku": f"SKU-{i.product.id}-{i.store.id}" # Fake SKU
        })
    return jsonify(results)

@api_bp.route('/transfer', methods=['POST'])
def execute_transfer():
    data = request.json
    # Expect: { "inventory_id": int, "dest_store_id": int, "quantity": int }
    
    source_inv = Inventory.query.get(data['inventory_id'])
    if not source_inv:
        return jsonify({"message": "Source inventory not found"}), 404
        
    qty = int(data['quantity'])
    if source_inv.quantity < qty:
        return jsonify({"message": "Insufficient stock"}), 400
        
    dest_store = Store.query.get(data['dest_store_id'])
    if not dest_store:
        return jsonify({"message": "Destination store not found"}), 404
        
    # 1. Decrement Source
    source_inv.quantity -= qty
    
    # 2. Increment/Create Destination
    dest_inv = Inventory.query.filter_by(
        store_id=dest_store.id, 
        product_id=source_inv.product_id
    ).first()
    
    if dest_inv:
        dest_inv.quantity += qty
    else:
        # Create new record if it doesn't exist
        dest_inv = Inventory(
            store_id=dest_store.id,
            product_id=source_inv.product_id,
            quantity=qty,
            weekly_sales_velocity=0.0
        )
        db.session.add(dest_inv)
        
    db.session.commit()
    return jsonify({"message": "Transfer Successful", "new_source_qty": source_inv.quantity}), 200

from ml_engine import forecaster

@api_bp.route('/analytics/forecast', methods=['GET'])
def get_forecast():
    # Lazy training
    if not forecaster.is_trained:
         products = Product.query.all()
         forecaster.train(products)
    
    # Generate forecasts for all products
    products = Product.query.all()
    results = []
    for p in products:
        prediction = forecaster.predict_next_week(p)
        results.append({
            "product_id": p.id,
            "product_name": p.name,
            "predicted_next_week": prediction,
            "trend": "Rising" if prediction > 40 else "Stable"
        })
        
    return jsonify(results)

@api_bp.route('/recommendations/<int:id>/approve', methods=['POST'])
def approve_recommendation(id):
    rec = TransferRecommendation.query.get(id)
    if not rec:
        return jsonify({"message": "Not found"}), 404
        
    # Execute Transfer
    source_inv = Inventory.query.filter_by(store_id=rec.source_store_id, product_id=rec.product_id).first()
    if source_inv:
        if source_inv.quantity >= rec.quantity:
            source_inv.quantity -= rec.quantity
            
            if rec.dest_store_id:
                dest_inv = Inventory.query.filter_by(store_id=rec.dest_store_id, product_id=rec.product_id).first()
                if dest_inv:
                    dest_inv.quantity += rec.quantity
                else:
                    new_inv = Inventory(store_id=rec.dest_store_id, product_id=rec.product_id, quantity=rec.quantity)
                    db.session.add(new_inv)
            
            # If Online (dest_store_id is None), we just decremented source, which is correct.
            
            db.session.delete(rec)
            db.session.commit()
            return jsonify({"message": "Approved"}), 200
            
    return jsonify({"message": "Failed"}), 400

@api_bp.route('/recommendations/<int:id>/reject', methods=['POST'])
def reject_recommendation(id):
    rec = TransferRecommendation.query.get(id)
    if rec:
        db.session.delete(rec)
        db.session.commit()
    return jsonify({"message": "Rejected"}), 200

@api_bp.route('/stores/<int:id>/analytics', methods=['GET'])
def get_store_analytics(id):
    store = Store.query.get(id)
    if not store:
        return jsonify({"message": "Store not found"}), 404
        
    # 1. Fetch DNA (Affinity Scores)
    dna_entries = StoreDNA.query.filter_by(store_id=id).all()
    dna_data = [{"category": d.metric_key.replace("category_affinity_", ""), "score": d.score} for d in dna_entries]
    
    # Sort DNA by score desc
    dna_data.sort(key=lambda x: x['score'], reverse=True)
    
    # 2. Fetch High Demand (Active) vs Dead Stock
    # High Demand: Velocity > 5
    high_demand = db.session.query(Inventory).filter(
        Inventory.store_id == id,
        Inventory.weekly_sales_velocity > 5
    ).join(Product).all()
    
    # Dead Stock: Velocity < 2 AND Quantity > 0
    dead_stock = db.session.query(Inventory).filter(
        Inventory.store_id == id,
        Inventory.weekly_sales_velocity < 2,
        Inventory.quantity > 0
    ).join(Product).all()
    
    # Helper to format inventory list
    def format_inv(inv_list):
        return [{
            "product_name": i.product.name,
            "category": i.product.category,
            "quantity": i.quantity,
            "velocity": i.weekly_sales_velocity,
            "image_url": i.product.image_url
        } for i in inv_list]
        
    return jsonify({
        "store_name": store.name,
        "dna": dna_data,
        "high_demand": format_inv(high_demand),
        "dead_stock": format_inv(dead_stock)
    })
