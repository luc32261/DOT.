from flask import Flask
from flask_cors import CORS
from config import Config
from models import db, ma
from routes import api_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize Extensions
    db.init_app(app)
    ma.init_app(app)
    CORS(app)
    
    # Register Blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    with app.app_context():
        db.create_all()
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
