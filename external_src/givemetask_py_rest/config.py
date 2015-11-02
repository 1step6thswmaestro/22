__author__ = 'iljichoi'

ES_INDEX = 'givemetask'
ES_SEARCH_INDEX = ['_id', 'title', 'summary', 'userId', 'originId']

class base(object):
    DEBUG = True
    TESTING = False