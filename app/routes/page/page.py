from flask import Blueprint, current_app, render_template

bp = Blueprint('home', __name__)

@bp.route("/")
def hello_world():
    return render_template('home.html')

