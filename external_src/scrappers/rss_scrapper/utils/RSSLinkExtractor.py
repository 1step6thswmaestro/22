__author__ = 'iljichoi'
from MongoDBController import ConnectionPool, QueryManager
from BeautifulSoup import BeautifulSoup
import urllib
from datetime import datetime

class Extractor():

    def __init__(self):
        self.pool = ConnectionPool.Pool()
        self.qm = QueryManager.QueryPool(self.pool)

    def do_extracting_process(self):
        print 'Load html list... %s' % str(datetime.now())
        rss_html_list = self.get_rss_articles_html()

        print 'Parse href list... %s' % str(datetime.now())
        href_list = self.html_list_to_href_list(rss_html_list)

        print 'Parse rss list... %s' % str(datetime.now())
        rss_list = self.parse_rss_list(href_list)

        print 'Chk is it real rss link... %s' % str(datetime.now())
        rss_list = self.filter_really_rss(rss_list)

        print 'Insert from rss list to db... %s' % str(datetime.now())
        self.insert_rss_list_to_db(rss_list)

        self.pool.close_connection()
        print 'Finishing rss example list extraction process'

    def get_rss_articles_html(self):
        article_list = self.pool.do_querying(self.qm.get_rss_article_list)
        return [x['contentHtml'] for x in article_list]

    def get_href_list(self, html):
        soup = BeautifulSoup(html)
        alist = soup.findAll('a')
        result = []
        for item in alist:
            dic = dict(item.attrs)
            if 'href' in dic:
                result.append(dic['href'])
        return result

    def html_list_to_href_list(self, links):
        result = []
        for html in links:
            links = self.get_href_list(html)
            if links is None : continue
            result.extend(links)
        return result

    def parse_rss_list(self, links):
        # 1. filter same link
        # 2. rss or feed in link
        links = list(set(links))
        return filter(lambda x: 'rss' in x or 'feed' in x, links)

    def filter_really_rss(self, ls, minimum=1000):
        result = []
        for link in ls:
            try:
                doc = urllib.urlopen(link)
                if 'xml' not in doc.headers['Content-Type']:
                    continue
                else:
                    content = doc.read()
                    if len(content) >= minimum:
                        result.append(link)
            except Exception, e:
                print e.message
            finally:
                doc.close()
        return result

    def insert_rss_list_to_db(self, rss_list):
        self.pool.do_querying(self.qm.insert_rss_list, rss_list=rss_list)

if __name__=='__main__':
    ext = Extractor()
    ext.do_extracting_process()