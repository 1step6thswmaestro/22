__author__ = 'iljichoi'
from elasticsearch import Elasticsearch
import json
import config


class DocumentES():
    def __init__(self, app):
        self.es = Elasticsearch()
        self.index = config.ES_INDEX
        self.app = app

    # Task Call : {query : "", user_id : ""}
    def search(self, query, user_id, top_n=3):
        try:
            es_res = self.es.search(index=self.index, body=self.get_search_body(query, user_id))
        except Exception, e:
            self.app.logger.info(e.message)
        finally:
            return_object = self.res_to_json(es_res, top_n)
            if return_object is None:
                return_object = {}
            return return_object

    def get_search_body(self, query, user_id):
        result ={"query":
                     {"bool": {
                          {"must": [
                              {"term": {"userId" : user_id}},
                              {"match": {"title" : query}}
                            ]
                          } ,
                          {"should": [
                               {"match": {"summary": query}}
                            ]
                          }
                        }
                    }
                 }
        return result

    def res_to_json(self, res, top_n, score=0):
        if res is None:
            return {'total':0, 'hits':[]}
        filter_keys = config.ES_SEARCH_INDEX # response keys
        result = {}

        # insert the number of results
        #result['total'] = len(res['hits']['hits'])

        # insert document hits
        hits = []
        for item in res['hits']['hits']:
            if score > item['_score']: break # break on specified score
            if not all([k in item['_source'] for k in filter_keys]):
                continue
            dic = {'_id' : item['_id']}
            for k in filter_keys:
                if k == 'originId':
                    dic['link'] = item['_source'][k]
                    continue
                dic[k] = item['_source'][k]
            hits.append(dic)
        result['hits'] = hits[:top_n]
        return result