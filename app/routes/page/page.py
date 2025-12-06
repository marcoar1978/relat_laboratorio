from flask import Blueprint, current_app, render_template
from app.environment.datatable_pt import data_table_pt

bp = Blueprint('home', __name__)

@bp.route("/")
def hello_world():
    return render_template('home.html')


@bp.route('/dataTablePt')
def dataTablePt():
    return data_table_pt
