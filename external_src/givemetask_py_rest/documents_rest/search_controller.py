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
        if len(rss_list) >= whole_number['own_rss']:
            rss_list = self.get_counts_and_sort_docs(rss_list, whole_number['own_rss'])

        remain_numbers = whole_number['entire'] - (len(ever_list) + len(rss_list))
        # find other user's rss docs
        other_rss_list = self.es.search(query, user_id, topn=whole_number['check_topn'], contains_id=False, doc_type=0)
        if len(other_rss_list) >= remain_numbers:
            other_rss_list = self.get_counts_and_sort_docs(other_rss_list, remain_numbers)

        result = {'hits':[]}
        for item in ever_list['hits']:
            item['type'] = "evernote"
            result['hits'].append(item)
        for item in rss_list['hits']:
            item['type'] = "rss"
            result['hits'].append(item)
        for item in other_rss_list['hits']:
            item['type'] = "others"
            result['hits'].append(item)
        return result
        #return self.convert_list_to_json_type(rss_list)#, cluster_list)

    def get_counts_and_sort_docs(self, doc_list, topn):
        rss_id_list = [item['_id'] for item in doc_list['hits']]
        counts = self.app.query_pool.get_log_count_by_article_id(rss_id_list)

        count_list = Series(index=list(counts.keys()), data=list(counts.values()))
        count_list.sort(ascending=False)

        selected_id_and_count = count_list[:topn]

        result = {'hits' : []}
        for rss_item in doc_list['hits']:
            if rss_item['_id'] in selected_id_and_count.index:
                result['hits'].append(rss_item)
        return result

    def convert_list_to_json_type(self, rss_list, cluster_list):
        result = {'hits':[]}

        result['hits'] = rss_list['hits']
        for item in cluster_list:
            conv_item = {'link': item['originId'],
                         'summary': item['summary'],
                         'title': item['title'],
                         '_id': str(item['_id'])}
            result['hits'].append(conv_item)
        return result
        # <div className="doc-item" onClick={this.onDocumentClick.bind(this, this.props.doc._id)}>
			# 	<a href={this.props.doc.link} data-toggle="tooltip" title={this.props.doc.summary}>
			# 		{this.props.doc.title}
			# 	</a>
			# </div>