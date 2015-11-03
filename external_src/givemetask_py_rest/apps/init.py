__author__ = 'iljichoi'
import logging
from documents_rest.search_controller import SearchController
from data_controller import db_tools

# init all functions in this script
def init_all(app):
    apply_logger(app)
    app.es = init_search_controller(app)
    app.query_pool = init_db("host")
    app.query_pool2 = init_db("host2")

def apply_logger(app):
    app.logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler = logging.FileHandler("debug.log")
    file_handler.setFormatter(formatter)
    app.logger.addHandler(file_handler)

def init_search_controller(app):
    return SearchController(app)

def init_db(select_host):
    pool = db_tools.Pool(select_host=select_host)
    query_pool = db_tools.QueryPool(pool)
    return query_pool