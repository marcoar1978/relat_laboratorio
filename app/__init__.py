from flask import Flask
import sys
import os

from app.extensions import database
from app.environment.environment import Environment

from app.routes.page.page import bp as page
from app.routes.database.cliente import bp as cliente
from app.routes.database.relatorio import bp as relatorio


def create_app():
    if getattr(sys, 'frozen', False):
    # Running in a PyInstaller bundle
        template_dir = os.path.join(sys._MEIPASS, 'templates')
    else:
    # Running in development mode
        template_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'templates')
    
    app = Flask(__name__, template_folder=template_dir)
    app.config.from_object(Environment())
    database.init_app(app)

    app.register_blueprint(page, url_prefix='/')
    app.register_blueprint(cliente, url_prefix='/')
    app.register_blueprint(relatorio, url_prefix='/')

    return app

