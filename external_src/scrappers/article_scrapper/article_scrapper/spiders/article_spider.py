__author__ = 'iljichoi'
import scrapy
from scrapy.selector import Selector
from db_tools import *
from article_scrapper.items import ArticleScrapperItem
import html2text

class ArticleSpider(scrapy.Spider):
    name = 'article'
    def __init__(self):
        # import os
        # os.environ['http_proxy']=''
        pool = Pool()
        qm = QueryPool(pool)
        self.start_urls = pool.do_querying(qm.get_article_list)
        scrapy.log.msg('\n'.join(self.start_urls), level=scrapy.log.INFO, spider=self)
        pool.close_connection()

        self.allowed_domains = list(set([x[7:].split('/')[0] for x in self.start_urls]))
        print 'allowed %s' % str(self.allowed_domains)
        self.__url_mapping()

    def __url_mapping(self):
        #self.start_urls = ['m.'.join([url[:7], url[7:]]) for url in self.start_urls if 'naver' in url]
        ls = []
        for url in self.start_urls:
            if 'naver' in url:
                ls.append('m.'.join([url[:7], url[7:]]))
            else:
                ls.append(url)
        self.start_urls = ls

    def __url_unmapping(self, url):
        if 'naver' in url:
            return ''.join([url[:7], url[9:]])
        else:
            return url

    def parse(self, response):
        # print response.body
        print response
        sel = Selector(response)
        p_graphs = sel.xpath(".//p")
        div_graphs = sel.xpath("//div")
        frame_graphs = sel.xpath(".//frame")

        converter = html2text.HTML2Text()
        converter.ignore_links = True

        ls = [p.extract() for p in p_graphs+div_graphs+frame_graphs]
        max_item = ''
        for item in ls:
            item = converter.handle(item)
            # item = item.replace(' ','')
            if len(max_item.replace(' ', '')) < len(item.replace(' ', '')):
                max_item = item
        # print 'Max : %s' % max_item.replace('\n', '')
        i = ArticleScrapperItem()
        i['link'] = self.__url_unmapping(response.url)
        i['content'] = max_item
        return i
        # filename = response.url.split("/")[-2] + '.html'
        # with open(filename, 'wb') as f:
        #     f.write(response.body)
