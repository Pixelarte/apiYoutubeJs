function classApiYoutube(data)
{
	var _root=this;
	this.tokenApiYoutube;
	this.dataUserYoutube;
	this.OAUTH2_CLIENT_ID = data.id;
	this.OAUTH2_SCOPES = data.scope;

	this.playlistId;
	
	this.playlist;
	this.tokenPaginacion;

	this.player;
	this.optionsPlayer;


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

   	//preguntaremos si el usuario tiene videos o no.
   	this.VideosResponse=function(){
		var request = gapi.client.youtube.channels.list({
	      // Setting the "mine" request parameter's value to "true" indicates that
	      // you want to retrieve the currently authenticated user's channel.
	      mine: true,
	      part: 'id,contentDetails'
	    });
	    request.execute(function(response) {
	      if ('error' in response) {
	        console.log(response.error.message);
	        _root.errorListVideoYoutube();
	      } else {
	      	// saco el id del canal de videos subidos
			_root.playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
			// vemos si tiene contenido
			var request = gapi.client.youtube.playlistItems.list({
				playlistId: _root.playlistId,
			    part: 'snippet',
			    maxResults: 1
			});
			request.execute(function(response) {
				// vemos si por lo menos tiene un video.
				_root.playlist=response.result;
				if(response.result.items.length>0){
					_root.initContainerVideos(true);
				}else{
					_root.initContainerVideos(false);
				}
			});
	      }
	  });
   	}


   	//// trae la lista de videos y paginacion
   	this.VideosList=function(_max,_token){

   		_root.tokenPaginacion=_token;

   		var request = gapi.client.youtube.channels.list({
	      // Setting the "mine" request parameter's value to "true" indicates that
	      // you want to retrieve the currently authenticated user's channel.
	      mine: true,
	      part: 'id,contentDetails'
	    });

	    request.execute(function(response) {
	      if ('error' in response) {
	        console.log(response.error.message);
	        _root.errorListVideoYoutube();
	      } else {
			// saco el id del canal de videos subidos
			_root.playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
			// vemos si tiene contenido
			var options={
				playlistId: _root.playlistId,
			    part: 'snippet',
			    maxResults: _max
			}
			
			if(_root.tokenPaginacion){
				options.pageToken = _root.tokenPaginacion;
			}

			var request = gapi.client.youtube.playlistItems.list(options);

			request.execute(function(response) {

				 _root.playlist=response.result;

				 //_root.playlistItems = response.result.items;
				  if (_root.playlist.items) {
				  	  _root.initVideosList();
				   } else {
				      _root.errorListVideoYoutube();
				   }
			});
	      }
	    });
   	}

   	this.initPlayer=function(_selector,_width,_height,_autoplay,_controls){
   		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
      	var firstScriptTag = document.getElementsByTagName('script')[0];
      	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      	_root.optionsPlayer={selector:_selector,options:{
      		  height: _height,
	          width: _width,
	          playerVars: { 'autoplay': _autoplay, 'controls': _controls },
	          events: {
	            'onReady': readyPlayerYoutube,
	            'onStateChange': changePlayerYoutube
	          }
	      }
	    }
   	}

   	this.play=function(_options){
 		_root.player.loadVideoById(_options)
   	}

  
}

function onYouTubeIframeAPIReady(){
   	Youtube.player = new YT.Player(Youtube.optionsPlayer.selector, Youtube.optionsPlayer.options);
}

function readyPlayerYoutube(){
	Youtube.readyPlayerVideoYoutube();
}
function changePlayerYoutube(){
	Youtube.changePlayerVideoYoutube();
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

// el usuario tiene la menos un video.
classApiYoutube.prototype.initContainerVideos=function(data){
	this.dispatch("initContainerVideos",data);
}

// lista de video lista.
classApiYoutube.prototype.initVideosList=function(){
	this.dispatch("initVideosList");
}

// error lista de video
classApiYoutube.prototype.errorListVideoYoutube=function(){
	this.dispatch("errorListVideoYoutube");
}

// player ready
classApiYoutube.prototype.readyPlayerVideoYoutube=function(){
	this.dispatch("readyPlayerVideoYoutube");
}

// error lista de video
classApiYoutube.prototype.changePlayerVideoYoutube=function(){
	this.dispatch("changePlayerVideoYoutube");
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
DispatcherAPiYoutube.prototype.dispatch=function(event,response){
	if ( this.events[event] ) {
		var listeners = this.events[event], len = listeners.length;
		while ( len-- ) {
			typeof response !== 'undefined' ?  listeners[len](response) : listeners[len](this); // 
			//listeners[len](response);	//callback with self
		}		
	}
}