__author__ = 'iljichoi'
import json
import pymongo

class Pool():

    config_path = './db_config.json' # db_name, host, port,

    def __init__(self, select_host="host"):
        self.select_host = select_host
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
        if self.select_host == 'host':
            host = self.host
        else:
            host = self.host2
        return pymongo.MongoClient(
            host='mongodb://%s' % host, port=self.port, maxPoolSize=self.MAX_POOL_SIZE
        )

    def close_connection(self):
        self.pool.close()

    def do_querying(self, f, **options):
        conn = self.pool.get_database(self.db_name)
        result = f(conn, **options)
        return result
