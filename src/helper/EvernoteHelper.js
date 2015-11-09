'use strict'

var Evernote = require('evernote').Evernote;
var sanitizeHtml = require('sanitize-html');

var Q = require('q');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var _ = require('underscore');
var Article = mongoose.model('Article');

class EvernoteHelper{
	constructor(app){
		this.config = getConfig('evernote.json');
		this.evernote = new Evernote.Client(this.config[this.config.default].client);
	}

	getAuthURL(user){
		let defer = Q.defer();
		let redirectUrl = this.config[this.config.default].redirectUrl; // On success or failure.

		this.evernote.getRequestToken(this.config[this.config.default].callbackUrl, (error, oauthToken, oauthTokenSecret, results)=>{
			if(error){
				oauthToken='';
				oauthTokenSecret='';
				console.log('Error during Evernote getAuthURL().', error)
				defer.reject({oauthToken, oauthTokenSecret, redirectUrl});
			}
			else{
				var redirectUrl = this.evernote.getAuthorizeUrl(oauthToken);
				defer.resolve({oauthToken, oauthTokenSecret, redirectUrl});
			}
		});
		return defer.promise;
	}

	processAuthCode(user, sessionEvernote, oauthVerifier){
		let defer = Q.defer();
		this.evernote.getAccessToken(sessionEvernote.oauthToken, sessionEvernote.oauthTokenSecret, oauthVerifier, (error, oauthAccessToken, oauthAccessTokenSecret, results)=>{
			if(error){
				defer.reject(error);
			}
			else{
				defer.resolve(oauthAccessToken);
			}
		});
		return defer.promise;
	}
	getNotebookList(oauthAccessToken){
		let defer = Q.defer();

		var client = new Evernote.Client({token: oauthAccessToken});
		var noteStore = client.getNoteStore();
		noteStore.listNotebooks(function(err, notebooks) {
			if(err){
				defer.reject(err);
			}
			else{
				defer.resolve(notebooks);
			}
		});

		return defer.promise;
	}
	getNoteList(oauthAccessToken){
		let defer = Q.defer();

		var client = new Evernote.Client({token: oauthAccessToken});
		var noteStore = client.getNoteStore();

		var filter = new Evernote.NoteFilter({
			order: 2, // Sort by Updated
			ascending: false,
			timeZone: "Asia/Seoul",
			inactive: false
		});
		var offset = 0;
		var maxNotes = 10000;
		var resultSpec = new Evernote.NotesMetadataResultSpec({
			includeTitle: true,
			includeUpdated: true,
			includeNotebookGuid: true
		});
		noteStore.findNotesMetadata(filter, offset, maxNotes, resultSpec, function(err, metaNoteList) {
			if(err){
				defer.reject(err);
			}
			else{
				defer.resolve(metaNoteList);
			}
		});
		return defer.promise;
	}
	makeNoteList2Article(oauthAccessToken, user, metaNoteList){
		var client = new Evernote.Client({token: oauthAccessToken});
		var userStore = client.getUserStore();
		var userId = user._id;

		this._getUser(userStore).
		then(function(userEvernote){
			var noteStore = client.getNoteStore();
			metaNoteList.notes.forEach( function(note){
				var noteUrl = this._getNoteLink(userEvernote, note.guid);
				noteStore.getNoteContent(note.guid, (err, content)=>{
					if (err){
						console.log('Error. cannot get note\'s content. ', err);
					}
					else{
						var plainContent = sanitizeHtml(content, {
							allowedTags: [],
							allowedAttributes: []
						});
						var articleRaw ={
							title: note.title,
							originId: noteUrl,
							summary: plainContent,
							content: content,
							userId: userId,
							type: 1
						};

						var article = new Article(articleRaw);

						Q.nbind(article.save, article)()
						.fail(err=>{
							// Do nothing here. If error ocuurs it is probabilty key duplication error.
							// In that case it is okay to silently drop the err.
							// console.log('Error during saving note to Article DB.', err);
						});

					}
				});
			}.bind(this));
		}.bind(this))
		.fail((err)=>{
			console.log('Error during getting Evernote user info:', err);
		});
	}

	_getNoteLink(userEvernote, noteGuid){
		// Make note's url from ingredients.

		var userId = userEvernote.id;
		var shardId = userEvernote.shardId;
		var service = 'www.evernote.com';
		if(this.config[this.config.default].client.sandbox){
			service = 'sandbox.evernote.com'
		}
		var url = 'https://' + service + '/shard/' +shardId + '/nl/' + userId + '/' + noteGuid;
		return url;
	}

	_getUser(userStore) {
		// Get the User from userStore and return the user data struct.
		// Return Struct: User
		// https://dev.evernote.com/doc/reference/Types.html#Struct_User
		let defer = Q.defer();

		userStore.getUser(function(err, user) {
			if(err){
				defer.reject(err);
			}
			else{
				defer.resolve(user);
			}
		});

		return defer.promise;
	}
};


module.exports = function(app){
	app.helper.evernote = new EvernoteHelper(app);
}
