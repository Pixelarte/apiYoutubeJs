function classApiYoutube(id,scope)
{
	var _root=this;
	this.tokenApiYoutube;
	this.dataUserYoutube;
	this.OAUTH2_CLIENT_ID = id;
	this.OAUTH2_SCOPES = scope;

	this.playlistId;
	this.playlistItems;


	// consulta si estas conectado y los permisos
	this.checkAuth=function(){
		 gapi.auth.authorize({
		    client_id: _root.OAUTH2_CLIENT_ID,
		    scope: _root.OAUTH2_SCOPES,
		    immediate: true
		  }, _root.handleAuthResult);
	}

	// clic para conectarse el mismo codigo qu se ejecuta automaticamente
	this.initConnectYoutube=function(){
		      gapi.auth.authorize({
	        client_id: _root.OAUTH2_CLIENT_ID,
	        scope: _root.OAUTH2_SCOPES,
	        immediate: false
	        }, _root.handleAuthResult);
    }


	// resultado si estas con permisos o no al conectar
	this.handleAuthResult=function(authResult) {

	  if(authResult.error=="access_denied"){
		_root.accessDeniedYoutube();
	  }else{
		  if (authResult && !authResult.error) {
		     // mostrara tus datos si estas conectado.
		     _root.tokenApiYoutube=authResult.access_token;
		     _root.loadAPIClientInterfaces();
		  } else {
		  	 // debes conectarte
			 _root.initButtonConnectYoutube();
		  }
	  }
	}

	// carga el cliente youtube
	this.loadAPIClientInterfaces=function() {

	  gapi.client.load('youtube', 'v3', function() {
	   		gapi.client.load('oauth2', 'v2', function() {
		   		_root.getUserData();
		  });
	  });
	}

	// datos del usuario de gmail
  	this.getUserData=function(){
	  	 var userInfo = gapi.client.oauth2.userinfo.get();
	   		userInfo.execute(function(response) {
	   			_root.dataUserYoutube=response;
	   			_root.EventConnectYoutube();
	   		})
   	}

   	this.channelsList=function(){
   		var request = gapi.client.youtube.channels.list({
	      // Setting the "mine" request parameter's value to "true" indicates that
	      // you want to retrieve the currently authenticated user's channel.
	      mine: true,
	      part: 'id,contentDetails'
	    });

	    request.execute(function(response) {
	      if ('error' in response) {
	        console.log(response.error.message);
	      } else {
			// saco el id del canal
			_root.playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
			// ahora sacaremos la lista
			var request = gapi.client.youtube.playlistItems.list({
			    playlistId: _root.playlistId,
			    part: 'snippet',
			    maxResults: 10
			});
			request.execute(function(response) {
				 _root.playlistItems = response.result.items;
				  if (_root.playlistItems) {
				      $.each(_root.playlistItems, function(index, item) {
				        	 var title = item.snippet.title;
  							 var videoId = item.snippet.resourceId.videoId;
  							 var thumbs = item.snippet.thumbnails.default.url;
  							$('#videoContainer').append('<p><img id="imagen" src="'+thumbs+'"><a target="_blank" href="https://www.youtube.com/watch?v='+videoId+'">' + title + '</a></p>');
				      });
				   } else {
				      $('#videoContainer').html('no tienes videos subidos a tu canal');
				   }
			});
	      }
	    });
   	}


}


// dispatcher event's

classApiYoutube.prototype = new DispatcherAPiYoutube();
 
// cuando te conectas
classApiYoutube.prototype.initButtonConnectYoutube=function(){
	this.dispatch("initButtonConnectYoutube");
}
// cuando estas conectado y entras de forma automatica
classApiYoutube.prototype.EventConnectYoutube=function(){
	this.dispatch("EventConnectYoutube");
}

// cuando no acepta los permisos el usuario
classApiYoutube.prototype.accessDeniedYoutube=function(){
	this.dispatch("accessDeniedYoutube");
}

function DispatcherAPiYoutube(){
	this.events=[];
}
DispatcherAPiYoutube.prototype.addEventlistener=function(event,callback){
	this.events[event] = this.events[event] || [];
	if ( this.events[event] ) {
		this.events[event].push(callback);
	}
}
DispatcherAPiYoutube.prototype.removeEventlistener=function(event,callback){
	if ( this.events[event] ) {
		var listeners = this.events[event];
		for ( var i = listeners.length-1; i>=0; --i ){
			if ( listeners[i] === callback ) {
				listeners.splice( i, 1 );
				return true;
			}
		}
	}
	return false;
}
DispatcherAPiYoutube.prototype.dispatch=function(event){
	if ( this.events[event] ) {
		var listeners = this.events[event], len = listeners.length;
		while ( len-- ) {
			listeners[len](this);	//callback with self
		}		
	}
}