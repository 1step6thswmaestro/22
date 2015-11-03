from elastic_search import DocumentES
from search_cluster import SearchCluster
from config import NUMBER_DOCS

class SearchController():
    def __init__(self, app):
        self.app = app
        self.es = DocumentES(app)
        self.cluster = SearchCluster(app)

    def determine_numbers(self, user_id):
        # logic to determine how many numbers to use in
        # elasticsearch or same cluster.
        user_article_count = self.app.query_pool2.get_article_count(user_id)

        number = NUMBER_DOCS

        if user_article_count < 100:
            rss_number = 0
            cluster_number = number
        elif user_article_count < 500:
            rss_number = number / 3
            cluster_number = number / 3 * 2
        else:
            rss_number = number / 3 * 2
            cluster_number = number / 3

        return rss_number, cluster_number

    def search(self, user_id, query):
        rss_number, cluster_number = self.determine_numbers(user_id)

        self.app.logger.info('RSS NUMBER : %d, CLUSTER NUMBER : %d' % (rss_number, cluster_number))
        if rss_number > 0:
            rss_list = self.es.search(query, user_id, rss_number)
        else:
            rss_list = {'hits':[]}

        if cluster_number > 0:
            cluster_list = self.cluster.get_articles(user_id, query, cluster_number)
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