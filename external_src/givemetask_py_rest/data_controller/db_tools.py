__author__ = 'iljichoi'
import json
import pymongo

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