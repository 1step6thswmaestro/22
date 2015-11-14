__author__ = 'iljichoi'

ES_INDEX = 'givemetask'
ES_SEARCH_INDEX = ['_id', 'title', 'summary', 'originId']
ES_HOST, ES_PORT = '192.168.175.128', 9200
ES_SCORE = 0.5

# Files
FILE_DIR = '../temp/'
WORD2VEC_MODEL = FILE_DIR + 'word2vec_model.sv'
PIPE_DUMPING = FILE_DIR + 'pipe_dump.sv'

# recommandation number
NUMBER_DOCS = {
    'ever_note' : 2,
    'own_rss' : 2,
    'check_topn' : 20,
    'entire' : 5
}

class base(object):
    DEBUG = True
    TESTING = False
