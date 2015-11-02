__author__ = 'iljichoi'
from MongoDBController import ConnectionPool, QueryManager
import sys
def sync_feedlies_to_rss():
    print 'DB Config Starts ...'
    pool1 = ConnectionPool.Pool()
    pool2 = ConnectionPool.Pool(select_host='host2')
    qm = QueryManager.QueryPool()

    print '************Update RSS LIST!***************'
    rss_list = pool2.do_querying(qm.get_feed_list)
    pool1.do_querying(qm.feed_update, rss_list=rss_list)

    pool1.close_connection()
    pool2.close_connection()
    print '************rss list update complete**********'

def update_article_links_on_rss():
    print 'DB configuration starts ...'
    pool = ConnectionPool.Pool()
    qm = QueryManager.QueryPool()

    print '**********Update Process Start!!!*************'

    pool.do_querying(qm.update_article_url_list)
    pool.close_connection()
    print '** feed list update process complete **'

if __name__=='__main__':
    options = sys.argv[1:]
    if options[0] == 'update_links':
        update_article_links_on_rss()
    elif options[0] == 'update_rss':
        sync_feedlies_to_rss()
    else:
        print 'Nothing to do'