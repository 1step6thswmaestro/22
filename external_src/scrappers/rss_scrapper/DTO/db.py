__author__ = 'iljichoi'
import json

class RSS():
    def __init__(self, rss_link, subscription):
        self.rss_link = rss_link
        self.subscription = subscription

    def get_json(self):
        return json.dumps(self.__dict__)

class Article():
    #(posturl, imgurl, \
    #                               title, descr)
    def __init__(self, post_url, img_url, title, descr, content):
        self.post_url = post_url
        self.img_url = img_url
        self.title = title
        self.descr = descr
        self.content = content

    def get_json(self):
        return json.dumps(self.__dict__)