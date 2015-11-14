__author__ = 'iljichoi'
from elasticsearch import Elasticsearch
import config

class DocumentES():
    def __init__(self, app):
        self.es = Elasticsearch(hosts=['%s:%d' % (config.ES_HOST, config.ES_PORT)])
        self.index = config.ES_INDEX
        self.app = app

    #it receives parameters for elasticsearch
    def search(self, query, user_id, topn, contains_id=True, doc_type=0):
        try:
            es_res = self.es.search(index=self.index, body=self.get_search_body(query, user_id, topn, contains_id, doc_type))
        except Exception, e:
            self.app.logger.info(e.message)
        finally:
            return_object = self.res_to_json(es_res)
            if return_object is None:
                return_object = {}
            return return_object

    def get_search_body(self, query, user_id, topn, contains_id, doc_type):

        if contains_id: # it deals to search user's evernotes and rss
            result = {
                        "size": topn,
                        "min_score":config.ES_SCORE,
                        "aggs" : {
                            "docs" : {
                                "cardinality" : {"field" : "originId"}
                            }
                        },
                        "query":
                         {"bool":
                              {
                              "should": [
                                   {"match": {"title": query}},
                                   {"match": {"summary" : query}},
                                   {"match": {"content" : query}}
                                ],
                              "must": [
                                  {"term": {"userId": user_id}},
                                  {"term": {"type": doc_type}}
                              ]
                              }
                          }
                      }
        else:
            result = {
                "size": topn,
                "min_score": config.ES_SCORE,
                "aggs" : {
                    "docs" : {
                        "cardinality" : {"field" : "originId"}
                    }
                },
                "query" : {
                    "bool" : {
                        "must" : [
                            {
                                "filtered" : {
                                    "filter" : {
                                        "not" : {
                                            "term" : {
                                                "userId" : user_id
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "term": {"type": doc_type}
                            }
                        ],
                        "should" : [
                            {"match": {"title": query}},
                            {"match": {"summary" : query}},
                            {"match": {"content" : query}}
                        ]
                    }
                }
            }
        return result

    def res_to_json(self, res):
        if res is None:
            return {'total':0, 'hits':[]}
        filter_keys = config.ES_SEARCH_INDEX # response keys
        result = {}

        # insert document hits
        hits = []
        for item in res['hits']['hits']:
            if not all([k in item['_source'] for k in filter_keys]):
                continue
            dic = {'_id' : item['_id']}
            for k in filter_keys:
                if k == 'originId':
                    dic['link'] = item['_source'][k]
                    continue
                dic[k] = item['_source'][k]
            hits.append(dic)
        result['hits'] = hits
        return result