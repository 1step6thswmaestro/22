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
		// Put lucene server address here.
		var url = "http://localhost:8888";

		$.ajax({
			url: url,
			data: data
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
		// Dummy work
		var data={
			total: 2,
			hits: [
				{
					_id : '001',
					title : '네이버로 가는 일번문서',
					summary : '일번문서는 내용이 존재한다.',
					link : 'http://naver.com'
				},
				{
					_id : '002',
					title : '구글로 가는 이번문서',
					summary : '이번문서 또한 내용이 존재한다.',
					link : 'http://google.com'
				}
			]
		};
		callback(data.hits);
		return;
		// --- Dummy ends here ---


		var data = {
			query: '한국',
			user_id: 'dummyID'
		};
		// Put lucene server address here.
		var url = "http://localhost:8888";

		$.ajax({
			url: url,
			data: data
		})
		.then(
			function(data){
				// var name 'total' is useless.
				callback(data.hits);
			}
			, function(XMLHttpRequest, textStatus, errorThrown) {
				console.error(url);
				console.error(errorThrown);
			}
		);
	}

	render() {
		function createDocElements(list){
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
