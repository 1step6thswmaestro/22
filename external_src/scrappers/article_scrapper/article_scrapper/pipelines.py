# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
from spiders.db_tools import Pool, QueryPool
from scrapy.exceptions import DropItem
from scrapy import log

class ArticleScrapperPipeline(object):

    def open_spider(self, spider):
        self.pool = Pool()
        self.queries = QueryPool(self.pool)

    def process_item(self, item, spider):
        for data in item:
            if not data:
                raise DropItem("Missing data!")
        # print item
        self.pool.do_querying(self.queries.insert_article_content, link=item['link'], content=item['content'])
        log.msg('%s content insert into db, complete' % item['link'], level=log.INFO, spider=spider)
        return item

    def close_spider(self, spider):
        self.pool.close_connection()
