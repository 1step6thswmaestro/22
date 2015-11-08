__author__ = 'iljichoi'

ES_INDEX = 'givemetask'
ES_SEARCH_INDEX = ['_id', 'title', 'summary', 'userId', 'originId']
ES_HOST, ES_PORT = '128.199.166.149', 9200
ES_SCORE = 0.5

# Files
FILE_DIR = '../temp/'
WORD2VEC_MODEL = FILE_DIR + 'word2vec_model.sv'
PIPE_DUMPING = FILE_DIR + 'pipe_dump.sv'

# recommandation number
NUMBER_DOCS = 3

class base(object):
    DEBUG = True
    TESTING = False