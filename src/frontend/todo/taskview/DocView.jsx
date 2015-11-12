import React from 'react'

import { createStore } from 'redux'
import { connect } from 'react-redux';

import _ from 'underscore'

class DocItem extends React.Component{
	constructor(){
		super();
	}
	onDocumentClick(docID){
		var data = {
			id: docID,
			user_id: this.props.user_id
		};
		var query = this.props.keyword;

		$.ajax({
			url: '/v1/doc/log'
			, data: {
				'user_id': data.user_id
				, 'article_id': data.id
				, 'query': query
			}
		})
	}
	render() {
		return (
			<div className="doc-item" onClick={this.onDocumentClick.bind(this, this.props.doc._id)}>
				<h5> 
					{this.props.doc.type} : 
				</h5>
				<a href={this.props.doc.link} data-toggle="tooltip" title={this.props.doc.summary}>
					{this.props.doc.title}
				</a>
			</div>
		);
	}
};

class DocView extends React.Component{
	// Retrieve task related document from server, and print list of documents.
	constructor(){
		super();
		this.state = {
			waitMessage: '문서 가져오는 중...',
			docList: ''
		};
	}

	componentDidMount() {
		// Request related document from server.
		this.getDocumentList(function(docs){
			console.log('Docs : ' + docs);
			this.setState({
				waitMessage: '',
				docList: docs
			})
		}.bind(this));
	}

	getDocumentList(callback){
		var query = this.props.keyword;
		var user_id = this.props.user_id;

		$.ajax({
			url: '/v1/doc/recommand'
			, data: {
				'query' : query
				, 'user_id' : user_id
			}
		})
		.then(
			function(data){
				// var name 'total' is useless.
				if(data == null) {
					console.error('Json error');
				}
				else {
					console.log(data)
					var json = JSON.parse(data)
					var json_data = json['hits'];
					callback(json_data);
				}
			}
			, function(reuqest, textStatus, errorThrown) {
				console.log(textStatus);
				console.error(errorThrown);
			}
		);
	}

	render() {
		var query = this.props.keyword;
		var user_id = this.props.user_id;
		function createDocElements(list){
			return _.map(list, doc => (
		        <DocItem key={doc._id} doc={doc} keyword={query} user_id={user_id}/>
			));
	    }

		return (
			<div className="doc-view">
				<h4>참고하세요! {this.state.waitMessage}</h4>
				{createDocElements(this.state.docList)}
			</div>
		);
	}
};

export default DocView;
