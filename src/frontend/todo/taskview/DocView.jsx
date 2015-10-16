import React from 'react'

import { createStore } from 'redux'
import { connect } from 'react-redux';

import _ from 'underscore'

class DocItem extends React.Component{
	constructor(){
		super();
	}
	onDocumentClick(docID){
		console.log('Send Click Event');
		var data = {
			id: docID,
			user_id: 'dummyID'
		};
		// formatting /search/<user_id>/<doc_id>
		var url = "http://localhost:5000/searchLog/"+data.user_id+"/"+data.id;

		$.ajax({
			url: url,
			cache: false,
			method: 'POST'
		})
		.then(
			function(data){
				console.log('Response for doc click: '+ data);
			}
			, function(XMLHttpRequest, textStatus, errorThrown) {
				console.error(url);
				console.error(errorThrown);
			}
		);
	}
	render() {
		return (
			<div className="doc-item" onClick={this.onDocumentClick.bind(this, this.props.doc._id)}>
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
			docList: ''
		};
	}

	componentDidMount() {
		// Request related document from server.
		this.getDocumentList(function(docs){
			this.setState({
				docList: docs
			})
		}.bind(this));
	}

	getDocumentList(callback){
		// formatting /search/<user_id>/<query>
		var url = "http://127.0.0.1:5000/search/"+"dummyID"+"/"+"한국";

		$.ajax({
			url: url,
			cache: false,
			method: 'POST'
		})
		.then(
			function(data){
				// var name 'total' is useless.
				if(data == null) {
					console.error('Json error');
				}
				else {
					var json_data = data['hits'];
					callback(json_data);
				}
			}
			, function(reuqest, textStatus, errorThrown) {
				console.error(url);
				console.error(errorThrown);
			}
		);
	}

	render() {
		function createDocElements(list){
			console.log('in create' + list)
			return _.map(list, doc => (
		        <DocItem key={doc._id} doc={doc} />
			));
	    }

		return (
			<div className="doc-view">
				<h4>참고하세요!</h4>
				{createDocElements(this.state.docList)}
			</div>
		);
	}
};

export default DocView;
