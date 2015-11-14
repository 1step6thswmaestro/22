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

		if(this.props.doc.span != 0)
		{
			console.log(this);

			return (
				<tr className="table-row">
					<td className="doc-type" rowSpan={this.props.doc.span}>
						<h5>
							{this.props.doc.type}
						</h5>
					</td>
					<td className="doc-title">
						<a href={this.props.doc.link} data-toggle="tooltip" title={this.props.doc.summary}>
							{this.props.doc.title}
						</a>
					</td>
				</tr>
			);
		}

		return (
			<tr className="table-row">
				<td className="doc-title">
					<a href={this.props.doc.link} data-toggle="tooltip" title={this.props.doc.summary}>
						{this.props.doc.title}
					</a>
				</td>
			</tr>
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
			var count = 0;

			for(var i = list.length - 1 ; i > 0 ; i--)
			{
				count++;

				if(list[i].type != list[i-1].type)
				{
					list[i].span = count;
					count = 0;
				}
				else {
					list[i].span = 0;
				}
			}

			if(list.length > 0)
			{
				list[0].span = count + 1;
			}

			return _.map(list, doc => (
		        <DocItem key={doc._id} doc={doc} keyword={query} user_id={user_id}/>
			));
	    }

		return (
			<div className="doc-view">
				<h4>참고하세요! {this.state.waitMessage}</h4>
				<table className="doc-table">
					<thead className="table-header">
						<tr className="header-row">
							<th className="header-row-item">Type</th>
							<th className="header-row-item">제목</th>
						</tr>
					</thead>
					<tbody className="table-body">{createDocElements(this.state.docList)}</tbody>
				</table>
			</div>
		);
	}
};

export default DocView;
