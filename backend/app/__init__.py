from flask import Flask
from app.routes import api
from flask_cors import CORS
from dotenv import load_dotenv

def create_app():
    app = Flask(__name__)
    app.register_blueprint(api, url_prefix='/api')
    load_dotenv()
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    return app


app = create_app()