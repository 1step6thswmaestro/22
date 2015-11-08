from elastic_search import DocumentES
from search_cluster import SearchCluster
from config import NUMBER_DOCS

class SearchController():
    def __init__(self, app):
        self.app = app
        self.es = DocumentES(app)
        self.cluster = SearchCluster(app)


    def search(self, user_id, query):
        rss_list = self.es.search(query, user_id, NUMBER_DOCS)
        if len(rss_list) < NUMBER_DOCS:
            cluster_list = self.cluster.get_articles(user_id, query, NUMBER_DOCS-len(rss_list))
        else:
            cluster_list = []

        return self.convert_list_to_json_type(rss_list, cluster_list)

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