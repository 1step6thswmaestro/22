from elastic_search import DocumentES
from search_cluster import SearchCluster
from config import NUMBER_DOCS
from pandas import Series

class SearchController():
    def __init__(self, app):
        self.app = app
        self.es = DocumentES(app)
        self.cluster = SearchCluster(app)

    def search(self, user_id, query):

        whole_number = NUMBER_DOCS

        # find evernotes, doc_type 1 is evernote
        ever_list = self.es.search(query, user_id, topn=whole_number['ever_note'], contains_id=True, doc_type=1)

        # find own rss list
        rss_list = self.es.search(query, user_id, topn=whole_number['check_topn'], contains_id=True, doc_type=0)
        if len(rss_list['hits']) >= whole_number['own_rss']:
            rss_list = self.get_counts_and_sort_docs(rss_list, whole_number['own_rss'])

        remain_numbers = whole_number['entire'] - (len(ever_list) + len(rss_list))
        # find other user's rss docs
        other_rss_list = self.es.search(query, user_id, topn=whole_number['check_topn'], contains_id=False, doc_type=0)
        if len(other_rss_list['hits']) >= remain_numbers:
            other_rss_list = self.get_counts_and_sort_docs(other_rss_list, remain_numbers)

        result = {'hits':[]}
        self.fit_to_front_type(result, ever_list, 'evernote')
        self.fit_to_front_type(result, rss_list, 'rss')
        self.fit_to_front_type(result, other_rss_list, 'others')

        return result
        #return self.convert_list_to_json_type(rss_list)#, cluster_list)

    def get_counts_and_sort_docs(self, doc_list, topn):
        rss_id_list = [item['_id'] for item in doc_list['hits']]
        counts = self.app.query_pool.get_log_count_by_article_id(rss_id_list)

        result = {'hits' : []}
        if len(counts) >= topn:
            count_list = Series(index=list(counts.keys()), data=list(counts.values()))
            count_list.sort(ascending=False)

            selected_id_and_count = count_list[:topn]

            for rss_item in doc_list['hits']:
                if rss_item['_id'] in selected_id_and_count.index:
                    result['hits'].append(rss_item)
        elif len(counts) > 0 and len(counts) < topn:
            count = 0
            for item in doc_list['hits']:
                if item['_id'] in counts:
                    result['hits'].append(item)
                else:
                    if count < (topn - len(counts)):
                        count += 1
                        result['hits'].append(item)
        else:
            result['hits'] = doc_list['hits'][:topn]

        return result

    def fit_to_front_type(self, result, doc_list, type):
        for item in doc_list['hits']:
            item['type'] = type
            item['link'] = item['originId']
            del item['originId']
            result.append(item)