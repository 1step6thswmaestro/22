__author__ = 'iljichoi'
import json
import pymongo
from pandas import Series
from bson.objectid import ObjectId

class Pool():
    config_path = './db_config.json' # db_name, host, port,

    def __init__(self, select_host="host"):
        self.__load_config()
        self.select_host = select_host
        print 'Connect DB...'
        try:
            self.pool = self.__mk_pool()
            print 'Creating Pool is successed! '
        except Exception:
            raise Exception("DB Connection error")

    def __load_config(self):
        with open(self.config_path, 'r') as r:
            configs = json.load(r)

        for k, v in configs.iteritems():
            setattr(self, k, v)

    def __mk_pool(self):
        if self.select_host == "host":
            host = self.host
        else:
            host = self.host2
        return pymongo.MongoClient(
            host='mongodb://%s' % host, port=self.port, maxPoolSize=self.MAX_POOL_SIZE
        )

    def close_connection(self):
        self.pool.close()

class QueryPool():
    def __init__(self, pool):
        self.pool = pool.pool
        self.conn = self.pool.get_database(pool.db_name)

    def insert_read_log(self, log):
        log_collection = self.conn.get_collection('article_read_log')
        log_collection.insert(log)

    def get_unparsed_content(self):
        article_collection = self.conn.get_collection('articles')
        unparsed_content = [item['content'] for item in list(article_collection.find({"$where":"this.content.length>0", "parsed":{"$exists": "false"}}))]
        return unparsed_content

    def get_tasks(self):
        tasks_collection = self.conn.get_collection('tasks')
        tasks = [(item['_id'], item['name']) for item in list(tasks_collection.find())]
        return map(list, zip(*tasks))

    def attach_task_label(self, task_ids, labels):
        log_collection = self.conn.get_collection('article_read_log')
        for idx, task_id, label in zip(range(len(task_ids)), task_ids, labels):
            if idx % 10000 == 0:
                print 'Attach task label process on %d' % idx
            log_collection.update_one({'task_id': task_id}, {'$set': {'label': label}})

    def get_rss_list(self, user_id):
        feed_collection = self.conn.get_collection('feedlies')
        result = feed_collection.find_one({"user_id" : user_id})
        if not result:
            return None
        return result['rss_list']

    def get_same_cluster_articles(self, user_id, label, topn=3):
        log_collection = self.conn.get_collection('article_read_log')

        print 'User Id : %s, label : %s' % (user_id, label)
        print 'function(obj, prev) {prev.count++}'
        ls = log_collection.group(
            {'article_id': True},
            {'label' : label, 'user_id' : {'$ne' : user_id}},
            {'count' : 0},
            'function(obj, prev) {prev.count[0]++}'
        )

        ls_conv = {'article_id' :[], 'count': []}
        for item in ls:
            ls_conv['article_id'].append(item['article_id'])
            ls_conv['count'].append(item['count'])
        s = Series(index=ls_conv['article_id'], data=ls_conv['count'])

        s.sort(ascending=False) # sorting
        return s.keys()[:topn]

    def get_article_count(self, user_id):
        article_collection = self.conn.get_collection('articles')
        return article_collection.find({'userId' : ObjectId(user_id)}).count()

    def get_article_list_by_id(self, article_id_list):
        article_collection = self.conn.get_collection('articles')
        return list(article_collection.find({'userid' : {'$in' : [ObjectId(id) for id in article_id_list]}}))