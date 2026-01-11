from app import create_app, db
from models import Product

app = create_app()
with app.app_context():
    p = Product.query.filter_by(name='Bamboo Yoga Pants').first()
    if p:
        print(f"IMAGE_URL: {p.image_url}")
    else:
        print("Product not found")
