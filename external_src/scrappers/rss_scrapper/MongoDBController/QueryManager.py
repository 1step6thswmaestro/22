__author__ = 'iljichoi'
import json
from DTO.db import *
import feedparser
import pytz
from datetime import datetime
from dateutil.parser import parse

class QueryPool():

    def __init__(self):
        self.__first_db_setting()

    def __first_db_setting(self):
        # self.pool.do_querying(self.__chk_and_create_coll)
        # self.pool.do_querying(self.__create_unique_key)
        pass

    def __chk_and_create_coll(self, conn):
        config_path = './db_config.json'
        with open(config_path, 'r') as r:
            configs = json.load(r)

        names = conn.collection_names()
        coll_names = configs.get('collection_names', [])

        for coll in list(set(names)-set(coll_names)):
            conn.create_collection(coll)
            print 'Collection %s is created !' % coll

    def __create_unique_key(self, conn):
        rss_collection = conn.get_collection('rss_list')
        rss_collection.ensure_index('rss_link', unique=True, sparse=True)

    def get_feed_list(self, conn):
        result = []
        for item in conn.get_collection('feedlies').find():
            if len(item[u'rss_list']) != item[u'rss_updated']:
                result.extend(item[u'rss_list'])
        return list(set(result))

    def feed_update(self, conn, rss_list=[]):
        rss_list = [RSS(rss, '').__dict__ for rss in rss_list]
        # if you have to insert some subscription, modify empty string to something

        rss_collection = conn.get_collection('rss_list')
        print 'The number of whole rss is %d' % len(rss_list)
        count = 0
        for rss in rss_list:
            try:
                if not rss_collection.find_one({'rss_link' : rss['rss_link']}):
                    rss_collection.insert(rss)
                    count += 1
            except Exception:
                pass
        print 'Inserting rss list is completed !, %d documents is affected' % count

    def get_feed_list(self, conn):
        rss_collection = conn.get_collection('rss_list')
        return map(lambda x : (x.get('rss_link'), x.get('last_updated')), rss_collection.find())

    def insert_article(self, conn, article):
        article_collection = conn.get_collection('articles')
        article_collection.insert(article)
#        print '%s is inserted' % article['title']

    def update_article_url_list(self, conn):
        feed_list = self.get_feed_list(conn)

        for feed, last_update in feed_list:
            feed_link = feed[5:] if feed.startswith('feed/') else feed
            parser = feedparser.parse(feed_link)
            entries = parser['entries']
            for entry in entries:
                key = 'published'
                if key not in entry:
                    if 'updated' not in entry:
                        entry['updated']=datetime.now()
                    key = 'updated'
                time = entry[key]
                if last_update is not None:
                    if last_update.tzinfo is None or last_update.tzinfo.utcoffset(last_update) is None:
                        update_time = pytz.utc.localize(last_update)
                    else:
                        update_time = last_update

                    if type(time) is str or type(time) is unicode:
                        try:
                            time = parse(time)
                        except Exception:
                            continue
                    if time.tzinfo is None or time.tzinfo.utcoffset(time) is None:
                        time = pytz.utc.localize(time)
                    if time <= update_time:
                        continue
                entry['master_feed'] = feed
                entry['content'] = ''
#if key+'_parsed' in entry:
#                    del entry[key+'_parsed']
                parsed_keys = [k for k in entry.iterkeys() if 'parse' in k or '.' in k]
                for k in parsed_keys:
                    del entry[k]
                self.insert_article(conn, article=entry)
            self.update_feed_time(conn, link=feed)
            print '%s rss articles updated at %s' % (feed, str(datetime.now()))
    
    def update_feed_time(self, conn, link):
        rss_collection = conn.get_collection('rss_list')
        time = datetime.now()
        rss_collection.update({'rss_link':link}, {'$set':{'last_updated' : time}})
        print 'feed update is completed at %s' % str(time)

    def get_article_list(self, conn):
        article_collection = conn.get_collection('articles')
        none_update_list = [item['link'] for item in list(article_collection.find({'content':''}))]
        return none_update_list

    def insert_article_content(self, conn, link, content):
        article_collection = conn.get_collection('articles')
        article_collection.update({'link':link}, {'$set': {'content':content}})

    def get_rss_article_list(self, conn):
        rss_article_collection = conn.get_collection('rss_articles')
        return list(rss_article_collection.find())

    def insert_rss_list(self, conn, rss_list):
        def get_rss_doc_type(link):
            return {"subscription" : "", "rss_link" : link }
        rss_list_collection = conn.get_collection('rss_list')
        rss_list_collection.insert_many([get_rss_doc_type(link) for link in rss_list])
        print 'Insert rss list complete'
