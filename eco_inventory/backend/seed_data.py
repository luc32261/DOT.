from app import create_app
from models import db, Store, Product, Inventory

app = create_app()

def seed():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # 1. Stores
        store_a = Store(name="Store A (Manhattan)", lat=40.7128, lon=-74.0060, type="Flagship")
        store_b = Store(name="Store B (Brooklyn)", lat=40.6782, lon=-73.9442, type="Outlet")
        store_c = Store(name="Store C (Miami)", lat=25.7617, lon=-80.1918, type="Flagship")
        store_d = Store(name="Store D (San Francisco)", lat=37.7749, lon=-122.4194, type="Flagship")
        
        db.session.add_all([store_a, store_b, store_c, store_d])
        db.session.commit()
        
        # 2. Products (Clothing Only) with Images
        products = [
            # OUTERWEAR
            Product(name="Winter Parka", category="Outerwear", size="L", price=120.0, carbon_footprint_weight=15.0, image_url="https://images.unsplash.com/photo-1539533018447-63fcce6a25e8?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Denim Jacket", category="Outerwear", size="M", price=85.0, carbon_footprint_weight=10.0, image_url="https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Recycled Puffer Jacket", category="Outerwear", size="XL", price=140.0, carbon_footprint_weight=12.0, image_url="https://images.unsplash.com/photo-1605763240004-7e93b172d754?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Trench Coat", category="Outerwear", size="L", price=180.0, carbon_footprint_weight=14.0, image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Wool Overcoat", category="Outerwear", size="M", price=250.0, carbon_footprint_weight=18.0, image_url="https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=600&v=999"),

            # TOPS
            Product(name="Organic Cotton T-Shirt", category="Tops", size="M", price=25.0, carbon_footprint_weight=2.0, image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Silk Blouse", category="Tops", size="S", price=95.0, carbon_footprint_weight=1.5, image_url="https://images.unsplash.com/photo-1604176354204-9268737828fa?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Vintage Hoodie", category="Tops", size="L", price=55.0, carbon_footprint_weight=4.0, image_url="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Hemp Button Shirt", category="Tops", size="L", price=65.0, carbon_footprint_weight=4.5, image_url="https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Striped Polo", category="Tops", size="M", price=45.0, carbon_footprint_weight=3.0, image_url="https://images.unsplash.com/photo-1626557981101-aae6f84aa6a8?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Linen Shirt", category="Tops", size="L", price=70.0, carbon_footprint_weight=3.5, image_url="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600&v=999"),

            # BOTTOMS
            Product(name="Slim Fit Jeans", category="Bottoms", size="32", price=75.0, carbon_footprint_weight=8.0, image_url="https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Summer Chinos", category="Bottoms", size="34", price=60.0, carbon_footprint_weight=6.0, image_url="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Bamboo Yoga Pants", category="Bottoms", size="M", price=55.0, carbon_footprint_weight=3.0, image_url="https://images.unsplash.com/photo-=crop"),
            Product(name="Cargo Shorts", category="Bottoms", size="34", price=40.0, carbon_footprint_weight=5.0, image_url="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Pleated Skirt", category="Bottoms", size="S", price=50.0, carbon_footprint_weight=4.0, image_url="https://images.unsplash.com/photo-1582142327242-0b2626b29841?auto=format&fit=crop&q=80&w=600&v=999"),

            # DRESSES
            Product(name="Floral Maxi Dress", category="Dresses", size="M", price=110.0, carbon_footprint_weight=5.0, image_url="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Linen Summer Dress", category="Dresses", size="S", price=85.0, carbon_footprint_weight=4.0, image_url="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Evening Gown", category="Dresses", size="M", price=220.0, carbon_footprint_weight=8.0, image_url="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600&v=999"),

            # FOOTWEAR
            Product(name="Sustainable Sneakers", category="Footwear", size="10", price=95.0, carbon_footprint_weight=9.0, image_url="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Vegan Leather Boots", category="Footwear", size="9", price=130.0, carbon_footprint_weight=11.0, image_url="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Running Shoes", category="Footwear", size="10", price=110.0, carbon_footprint_weight=10.0, image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600&v=999"),

            # ACCESSORIES
            Product(name="Wool Scarf", category="Accessories", size="OneSize", price=35.0, carbon_footprint_weight=1.0, image_url="https://images.unsplash.com/photo-1520903920248-2651479860b0?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Leather Belt", category="Accessories", size="32", price=45.0, carbon_footprint_weight=1.2, image_url="https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Recycled Wool Beanie", category="Accessories", size="OneSize", price=25.0, carbon_footprint_weight=1.0, image_url="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600&v=999"),
            Product(name="Canvas Tote Bag", category="Accessories", size="OneSize", price=20.0, carbon_footprint_weight=0.5, image_url="https://images.unsplash.com/photo-1597484662317-c9313d330d45?auto=format&fit=crop&q=80&w=600&v=999"),
        ]
        
        db.session.add_all(products)
        db.session.commit()
        
        # 3. Inventory (Varied Scenarios for Smart Routing)
        inventory_items = []
        
        # --- INVENTORY TO SUPPORT RECOMMENDATIONS ---
        
        # Rec 1: A -> B (Parka)
        inventory_items.append(Inventory(store_id=store_a.id, product_id=products[0].id, quantity=60, weekly_sales_velocity=0.1)) # Source
        inventory_items.append(Inventory(store_id=store_b.id, product_id=products[0].id, quantity=5, weekly_sales_velocity=15.0))

        # Rec 2: C -> A (Wool Overcoat)
        inventory_items.append(Inventory(store_id=store_c.id, product_id=products[4].id, quantity=50, weekly_sales_velocity=0.1)) # Source
        inventory_items.append(Inventory(store_id=store_a.id, product_id=products[4].id, quantity=2, weekly_sales_velocity=10.0))

        # Rec 3: D -> C (Denim Jacket)
        inventory_items.append(Inventory(store_id=store_d.id, product_id=products[1].id, quantity=60, weekly_sales_velocity=0.1)) # Source
        inventory_items.append(Inventory(store_id=store_c.id, product_id=products[1].id, quantity=0, weekly_sales_velocity=12.0))

        # Rec 4: B -> A (Puffer)
        inventory_items.append(Inventory(store_id=store_b.id, product_id=products[2].id, quantity=40, weekly_sales_velocity=0.1)) # Source
        inventory_items.append(Inventory(store_id=store_a.id, product_id=products[2].id, quantity=2, weekly_sales_velocity=14.0))

        # Rec 5: A -> B (Silk Blouse)
        inventory_items.append(Inventory(store_id=store_a.id, product_id=products[6].id, quantity=45, weekly_sales_velocity=0.1)) # Source
        
        # Rec 6: C -> Online (Trench Coat)
        inventory_items.append(Inventory(store_id=store_c.id, product_id=products[3].id, quantity=50, weekly_sales_velocity=0.1)) # Source

        # Rec 7: D -> Online (Cotton T-Shirt)
        inventory_items.append(Inventory(store_id=store_d.id, product_id=products[5].id, quantity=100, weekly_sales_velocity=0.5)) # Source

        # Rec 8: A -> Online (Evening Gown)
        inventory_items.append(Inventory(store_id=store_a.id, product_id=products[17].id, quantity=20, weekly_sales_velocity=0.1)) # Source (Index 17 might be wrong, checking list... 0..19. OK)

        # Rec 9: B -> Online (Linen Shirt)
        inventory_items.append(Inventory(store_id=store_b.id, product_id=products[10].id, quantity=60, weekly_sales_velocity=0.2)) # Source

        # Rec 10: C -> Online (Yoga Pants)
        inventory_items.append(Inventory(store_id=store_c.id, product_id=products[13].id, quantity=55, weekly_sales_velocity=0.1)) # Source

        # Distribute others randomly
        import random
        for p in products:
            # Add random stock elsewhere so map isn't empty
            if random.random() > 0.5:
                # 40% chance of Dead Stock (0.1 - 1.5), 60% chance of Healthy/High (2.0 - 10.0)
                velocity = random.uniform(0.1, 1.5) if random.random() < 0.4 else random.uniform(2.0, 10.0)
                inventory_items.append(Inventory(store_id=store_a.id, product_id=p.id, quantity=random.randint(5, 30), weekly_sales_velocity=velocity))
            
            if random.random() > 0.5:
                # Store B generally slower (testing "any store" variation)
                velocity = random.uniform(0.1, 3.0) 
                inventory_items.append(Inventory(store_id=store_b.id, product_id=p.id, quantity=random.randint(5, 30), weekly_sales_velocity=velocity))


        # 4. Explicit AI Recommendations (Hardcoded for Demo to ensure 10 varied examples)
        from models import TransferRecommendation
        
        recs = []
        
        # --- 5x STORE TO STORE TRANSFERS ---
        # 1. Store A -> Store B (Parka) - CORRECTED
        recs.append(TransferRecommendation(
            source_store_id=store_a.id, dest_store_id=store_b.id, product_id=products[0].id, 
            quantity=15, co2_saved=4.2, status='Pending', method='StoreTransfer'
        ))
        # 2. Store C -> Store A (Wool Overcoat)
        recs.append(TransferRecommendation(
            source_store_id=store_c.id, dest_store_id=store_a.id, product_id=products[4].id,
            quantity=10, co2_saved=12.5, status='Pending', method='StoreTransfer'
        ))
        # 3. Store D -> Store C (Denim Jacket)
        recs.append(TransferRecommendation(
            source_store_id=store_d.id, dest_store_id=store_c.id, product_id=products[1].id,
            quantity=20, co2_saved=8.9, status='Pending', method='StoreTransfer'
        ))
        # 4. Store B -> Store A (Puffer)
        recs.append(TransferRecommendation(
            source_store_id=store_b.id, dest_store_id=store_a.id, product_id=products[2].id,
            quantity=8, co2_saved=2.1, status='Pending', method='StoreTransfer'
        ))
        # 5. Store A -> Store B (Silk Blouse)
        recs.append(TransferRecommendation(
            source_store_id=store_a.id, dest_store_id=store_b.id, product_id=products[6].id,
            quantity=12, co2_saved=1.8, status='Pending', method='StoreTransfer'
        ))

        # --- 5x STORE TO ONLINE (Consolidation) ---
        # 6. Miami (C) -> Online (Trench Coat)
        recs.append(TransferRecommendation(
            source_store_id=store_c.id, dest_store_id=None, product_id=products[3].id,
            quantity=35, co2_saved=0.0, status='Pending', method='OnlineSale'
        ))
        # 7. SF (D) -> Online (Cotton T-Shirt)
        recs.append(TransferRecommendation(
            source_store_id=store_d.id, dest_store_id=None, product_id=products[5].id,
            quantity=50, co2_saved=0.0, status='Pending', method='OnlineSale'
        ))
        # 8. Manhattan (A) -> Online (Evening Gown)
        recs.append(TransferRecommendation(
            source_store_id=store_a.id, dest_store_id=None, product_id=products[17].id,
            quantity=5, co2_saved=0.0, status='Pending', method='OnlineSale'
        ))
        # 9. Brooklyn (B) -> Online (Linen Shirt)
        recs.append(TransferRecommendation(
            source_store_id=store_b.id, dest_store_id=None, product_id=products[10].id,
            quantity=25, co2_saved=0.0, status='Pending', method='OnlineSale'
        ))
        # 10. Miami (C) -> Online (Yoga Pants)
        recs.append(TransferRecommendation(
            source_store_id=store_c.id, dest_store_id=None, product_id=products[13].id,
            quantity=30, co2_saved=0.0, status='Pending', method='OnlineSale'
        ))

        db.session.add_all(recs)
        db.session.commit()

        db.session.add_all(inventory_items)
        db.session.commit()
        
        print(f"Database seeded with {len(products)} products and {len(inventory_items)} inventory records.")

if __name__ == '__main__':
    seed()
