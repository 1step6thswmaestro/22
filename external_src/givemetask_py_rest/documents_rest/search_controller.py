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
        rss_list = self.es.search(query, user_id)

        # This is for clustering docs. When the number is enough for accepting this rule, un-check comment
        # if len(rss_list) < NUMBER_DOCS:
        #     cluster_list = self.cluster.get_articles(user_id, query, NUMBER_DOCS-len(rss_list['hits']))
        # else:
        #     cluster_list = []

        # get log count from db and reordering documents by count
        if len(rss_list) > NUMBER_DOCS:
            rss_id_list = [item['_id'] for item in rss_list['hits']]
            counts = self.app.query_pool.get_log_count_by_article_id(rss_id_list)

            topn = NUMBER_DOCS
            count_list = Series(index=list(counts.keys()), data=list(counts.values()))
            count_list.sort(ascending=False)

            selected_id_and_count = count_list[:topn]

            result = {'hits' : [], 'total' : 0}
            for rss_item in rss_list['hits']:
                if rss_item['_id'] in selected_id_and_count.index:
                    result['hits'].append(rss_item)
        else:
            result = rss_list
            result['hits'] = result['hits'][:NUMBER_DOCS]

        return result
        #return self.convert_list_to_json_type(rss_list)#, cluster_list)

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