from app import create_app
from models import db, Product, Inventory

app = create_app()
with app.app_context():
    p_count = Product.query.count()
    i_count = Inventory.query.count()
    print(f"DIAGNOSTIC: Products={p_count}, Inventory={i_count}")
    
    if i_count > 0:
        print("SAMPLE INVENTORY:", Inventory.query.first().id)
