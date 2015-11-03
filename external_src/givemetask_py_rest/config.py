__author__ = 'iljichoi'

ES_INDEX = 'givemetask'
ES_SEARCH_INDEX = ['_id', 'title', 'summary', 'userId', 'originId']

# Files
FILE_DIR = '../temp/'
WORD2VEC_MODEL = FILE_DIR + 'word2vec_model.sv'
PIPE_DUMPING = FILE_DIR + 'pipe_dump.sv'

# recommandation number
NUMBER_DOCS = 3

class base(object):
    DEBUG = True
    TESTING = False