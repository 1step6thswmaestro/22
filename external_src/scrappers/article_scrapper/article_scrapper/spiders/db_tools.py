__author__ = 'iljichoi'
import json
import pymongo
from scrapy import log

class Pool():
    config_path = './db_config.json' # db_name, host, port,

    def __init__(self):
        self.__load_config()
        print 'Connect DB...'
        try:
            self.pool = self.__mk_pool()
            print 'Creating Pool is successed! '
        except Exception, e:
            raise Exception("DB Connection error")

    def __load_config(self):
        with open(self.config_path, 'r') as r:
            configs = json.load(r)

        for k, v in configs.iteritems():
            setattr(self, k, v)

    def __mk_pool(self):
        return pymongo.MongoClient(
            host='mongodb://%s' % self.host, port=self.port, maxPoolSize=self.MAX_POOL_SIZE
        )

    def do_querying(self, f, **options):
        conn = self.pool.get_database(self.db_name)
        result = f(conn, **options)
        return result

    def close_connection(self):
        self.pool.close()

class QueryPool():

    def __init__(self, pool):
        self.pool = pool
        self.__first_db_setting()

    def __first_db_setting(self):
        pass

        #self.pool.do_querying(self.__chk_and_create_coll)
        # self.pool.do_querying(self.__create_unique_key)

    def __chk_and_create_coll(self, conn):
        config_path = '../db_config.json'
        with open(config_path, 'r') as r:
            configs = json.load(r)

        names = conn.collection_names()
        coll_names = configs.get('collection_names', [])

        for coll in list(set(coll_names)-set(names)):
            conn.create_collection(coll)
            print 'Collection %s is created !' % coll

    def __create_unique_key(self, conn):
        rss_collection = conn.get_collection('rss_list')
        rss_collection.ensure_index('rss_link', unique=True, sparse=True)

    def get_article_list(self, conn):
        article_collection = conn.get_collection('articles')
        #none_update_list = [item['link'] for item in list(article_collection.find({'content':''})) if 'link' in item]
        none_update_list = [item['link'] for item in list(article_collection.find({"content":"", "link":{"$exists": "true"}}))]
        return none_update_list

    def insert_article_content(self, conn, link, content):
        article_collection = conn.get_collection('articles')
        article_collection.update({'link':link}, {'$set': {'content':content}})
