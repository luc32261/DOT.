from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

class Store(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False) # 'Flagship' or 'Outlet'
    
    inventory = db.relationship('Inventory', backref='store', lazy=True)
    dna = db.relationship('StoreDNA', backref='store', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(10), nullable=False)
    price = db.Column(db.Float, nullable=False)
    carbon_footprint_weight = db.Column(db.Float, nullable=False) # kg CO2e per unit
    image_url = db.Column(db.String(500), nullable=True)

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    weekly_sales_velocity = db.Column(db.Float, default=0.0)
    last_restock_date = db.Column(db.DateTime, nullable=True)

    product = db.relationship('Product', backref=db.backref('inventory', lazy=True))

class StoreDNA(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    metric_key = db.Column(db.String(50), nullable=False) # e.g., 'bias_size_S'
    score = db.Column(db.Float, nullable=False) # 0.0 - 1.0

class ManagerFeedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    comment = db.Column(db.String(255), nullable=True)
    feedback_type = db.Column(db.String(50), nullable=False) # 'ExternalFactor', etc.

class TransferRecommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source_store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    dest_store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=True) # Null if Online Direct Sale
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    co2_saved = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='Pending') # Pending, Approved, Rejected
    method = db.Column(db.String(20), nullable=False) # StoreTransfer, OnlineSale
    
    # Relationships for easier access
    source_store = db.relationship('Store', foreign_keys=[source_store_id])
    dest_store = db.relationship('Store', foreign_keys=[dest_store_id])
    product = db.relationship('Product')

# Schemas
class StoreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Store
    
    total_velocity = ma.Method("get_total_velocity")

    def get_total_velocity(self, obj):
        return round(sum(i.weekly_sales_velocity for i in obj.inventory), 1)

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product

class InventorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Inventory
    product = ma.Nested(ProductSchema)
    store = ma.Nested(StoreSchema)

class TransferRecommendationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TransferRecommendation
    source_store = ma.Nested(StoreSchema)
    dest_store = ma.Nested(StoreSchema)
    product = ma.Nested(ProductSchema)

store_schema = StoreSchema()
stores_schema = StoreSchema(many=True)
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
transfer_schema = TransferRecommendationSchema()
transfers_schema = TransferRecommendationSchema(many=True)
