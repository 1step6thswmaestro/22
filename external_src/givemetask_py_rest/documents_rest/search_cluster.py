from konlpy.tag import Mecab
from config import WORD2VEC_MODEL, PIPE_DUMPING
from sklearn.externals import joblib
import gensim
import numpy as np

class SearchCluster():
    def __init__(self, app):
        self.app = app
        self.mecab = Mecab()
        self.load_models()

    def load_models(self):
        self.word2vec = gensim.models.Word2Vec.load_word2vec_format(WORD2VEC_MODEL, binary=True)
        self.cluster_pipe = joblib.load(PIPE_DUMPING)

    def __task_to_vector(self, task):
        words = [key for key, pos in self.mecab.pos(task)]
        # aggregation word vectors
        vector = np.mean(np.array([self.word2vec[word] for word in words if word in self.word2vec]), axis=0)
        return vector

    def __predict_label(self, task):
        vector = self.__task_to_vector(task)
        return self.cluster_pipe.predict(vector)[0]

    def get_articles(self, user_id, task, topn=3):
        label = self.__predict_label(task)
        article_id_list = list(self.app.query_pool2.get_same_cluster_articles(user_id, label, topn))
        self.app.logger.info('article_id_list length : %d' % len(article_id_list))
        self.app.logger.info('article_id_list items : %s' % article_id_list)
        return list(self.app.query_pool2.get_article_list_by_id(article_id_list))