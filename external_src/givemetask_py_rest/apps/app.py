__author__ = 'iljichoi'
#!/usr/bin/python
from router import router_index
import init

from flask import Flask, jsonify
from flask.ext.cors import CORS, cross_origin
from werkzeug.exceptions import default_exceptions
from werkzeug.exceptions import HTTPException

__all__ = ['make_json_app']

def make_json_app(import_name, **kwargs):

    def make_json_error(ex):
        response = jsonify(message=str(ex))
        response.status_code = (ex.code
                                if isinstance(ex, HTTPException)
                                else 500)
        return response

    app = Flask(import_name, **kwargs)

    for code in default_exceptions.iterkeys():
        app.error_handler_spec[None][code] = make_json_error

    return app

def setup_cross_domain(app):
    cors = CORS(app, resources={r"/foo": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'

def create_app():
    app = make_json_app(__name__)
    # setup cross domain
    setup_cross_domain(app)

    # app basic configuration
    app.config.from_object('config.base')

    # init application
    init.init_all(app)

    # apply router
    router_index.apply(app)

    return app