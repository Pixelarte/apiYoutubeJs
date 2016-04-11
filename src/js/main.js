var Youtube;
var maxResultsVideos=2;

window.onload = init;

function init()
{
	console.log("followMe @PixelarteCl");

	Youtube=new classApiYoutube({
		'id':'895438985752-u3ncu8isbo7r4udupdm523bblec4r2m5.apps.googleusercontent.com',
		'scope':[
			  'https://www.googleapis.com/auth/youtube',//api js youtube
			  'https://www.googleapis.com/auth/youtube.force-ssl',//Manage your YouTube account
			  'https://www.googleapis.com/auth/youtube.readonly',//View your YouTube account
			  'https://www.googleapis.com/auth/youtube.upload',//Manage your YouTube videos
			  'https://www.googleapis.com/auth/youtubepartner',//View and manage your assets and associated content on YouTube
			  'https://www.googleapis.com/auth/youtubepartner-channel-audit',//View private information of your YouTube channel relevant during the audit process with a YouTube partner
			  'https://www.googleapis.com/auth/userinfo.profile' //google plus
			]
	});

	// si no te conectas de forma automatica este evento te da el aviso 
	//para levantar el boton connect y que el usuario lo haga de forma manual
	Youtube.addEventlistener("initButtonConnectYoutube",initButtonConnectYoutube);

	// al no dar permisos se dispara este evento
	Youtube.addEventlistener("accessDeniedYoutube",accessDeniedYoutube);

	// cuando te conectas satisfactoriamente en horabuena como dicen los españoles ctm!
	Youtube.addEventlistener("EventConnectYoutube",initConnectYoutube);



}

// funcion que llama la api de youtube al momento de cargar el js
function googleApiClientReady(){
	gapi.auth.init(function() {
   		window.setTimeout(Youtube.checkAuth, 1);
    });
}

// se muestra el boton connect desde el evento.
function initButtonConnectYoutube(){
	$('#connect').show();
	$('#connectYoutube').click(function() {
		$('#connect').hide();
		Youtube.initConnectYoutube();
	});
}

// desde evento sin permisos se dispara esta funcion
function accessDeniedYoutube(){
	$("#denied").show();
	$('#reload').click(function() {
		 //dentro de la sesion ya no puedes solicitar los permisos otra vez, por eso debes recargar el sitio.		
		location.reload();
	});
}

// cerrar sesion
function initCerrarSesion(){
	$('#sesion').show();
	// para deslogearse
   		$('#logOut').click(function() {
			$.ajax({
			  type: 'GET',
			  url: "https://accounts.google.com/o/oauth2/revoke?token="+Youtube.tokenApiYoutube,
			  async: false,
			  contentType: "application/json",
			  dataType: 'jsonp',
			  success: function(nullResponse) {
			     // no es necesario recargar el sitio, la sesion ya esta caducada, deprecate como la kate
			     location.reload();
			  },
			  error: function(e) {

			  }
			});
		});
}

// al conectarse con youtube y dar permisos
function initConnectYoutube(){
	initDatosUsuario();
	initCerrarSesion();
	initListaVideos();
}

// consultando datos de usuario
function initDatosUsuario(){
	$('#datos').show();
	//los datos ya se encuentran en la clase solo debes solicitarlos

	$('#imagen').attr('src',Youtube.dataUserYoutube.picture);
   	$('#id').html("id: "+Youtube.dataUserYoutube.id);
   	$('#nombre').html("nombre: "+Youtube.dataUserYoutube.name);
   	$('#correo').html("correo: "+Youtube.dataUserYoutube.email);
   	$('#token').html("access token: "+Youtube.tokenApiYoutube);
}

// solicitud lista video
function initListaVideos(){
	$('#listaVideo').click(function(){
		
		$('#listaVideo').hide();
		//consultamos si existen videos
		Youtube.VideosResponse();
		// si sucede algun error en las consultas lo controlamos aca.
		Youtube.addEventlistener("errorListVideoYoutube",errorListVideoYoutube);
		// resputa consulta si existen videos del usuario.
		Youtube.addEventlistener("initContainerVideos",initContainerVideos);
	});

	//init contenedor de video, debes preparar paginacion , player , etc.
	function initContainerVideos(data){
		$("#videoContainer").show();
		if(data){// si trae true es por que existen videos.
			$("#totalVideos").html("total de videos :"+Youtube.playlist.pageInfo.totalResults); //total videos
			
			//init player para reproducir video en iframe
			//https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#start
			Youtube.initPlayer(
					"player",
					"480",
					"320",
					{
						'showinfo':1,
						'controls':1
					}
				);
			// ready para comenzar a utilizar
			Youtube.addEventlistener("readyPlayerVideoYoutube",readyPlayerVideoYoutube);
			// cuando cambian alguna propiedad
			Youtube.addEventlistener("changePlayerVideoYoutube",changePlayerVideoYoutube);
			// cuando cambian la calidad del player
			Youtube.addEventlistener("changeQualityPlayerVideoYoutube",changeQualityPlayerVideoYoutube);
			// error en el player iframe
			Youtube.addEventlistener("errorPlayerVideoYoutube",errorPlayerVideoYoutube);
			
			// consultar lista video
			Youtube.VideosList(maxResultsVideos);
			// init lista videos
			Youtube.addEventlistener("initVideosList",initVideosList);

		}else{
			$("#totalVideos").html("total de videos :"+Youtube.playlist.pageInfo.totalResults); //total videos
		}
	}

	//traes la lista de videos para mostrarlos
	function initVideosList(){
		try{
			$('#next').unbind("click",nextListVideo);
			$('#prev').unbind("click",prevListVideo);
		}catch(e){}
	
		$.each(Youtube.playlist.items, function(index, item) { //recorremos la lista de videos
			var title = item.snippet.title;
	  		var videoId = item.snippet.resourceId.videoId;
	  		var thumbs = item.snippet.thumbnails.default.url;
	  		$('#videos').append('<p><img id="'+videoId+'" src="'+thumbs+'"></p><p><a target="_blank" href="https://www.youtube.com/watch?v='+videoId+'">' + title + '</a></p>');
	  		$('#'+videoId+'').bind("click",playVideo);
		});

		if(Youtube.playlist.nextPageToken){// si es tru, hay mas videos y debes contruir la paginacion
			$("#next").show();
			$('#next').bind("click",nextListVideo);
		}else{
			$("#next").hide();
		}

		if(Youtube.playlist.prevPageToken){// si es tru, hay mas videos y debes contruir la paginacion
			$("#prev").show();
			$('#prev').bind("click",prevListVideo);
		}else{
			$("#prev").hide();
		}
	}

	function playVideo(e){
		$("#playerContainer").show();
		var option={
			'videoId':e.currentTarget.id
			//'mediaContentUrl':String,
			//'startSeconds': 50,
            //'endSeconds': 60,
            //'suggestedQuality': 'large'
		}
		Youtube.play(option);
	}

	function nextListVideo(){
		$("#videos").html("");
		Youtube.VideosList(maxResultsVideos,Youtube.playlist.nextPageToken);// llamo ala misma funcion de la lisata de videos pero le paso el token de la pagina siguiente
	}
	function prevListVideo(){
		$("#videos").html("");
		Youtube.VideosList(maxResultsVideos,Youtube.playlist.prevPageToken);// llamo ala misma funcion de la lisata de videos pero le paso el token de la pagina anterior
	}

	function readyPlayerVideoYoutube(){
		//https://developers.google.com/youtube/iframe_api_reference#Playback_status
		//Youtube.player.seekTo(seconds:Number, allowSeekAhead:Boolean)
		//Youtube.player.clearVideo();// limpia contenedor player luego del stop
		//Youtube.player.mute();
		//Youtube.player.unMute();
		//Youtube.player.setVolume(volume:Number) // 1/100
		//Youtube.player.getVolume()// muestra el volumen actual
		//Youtube.player.setSize // en pixeles modifica el iframe

		Youtube.player.setVolume(100); // seteamos el volumen

		$("#btnStop").on("click",function(e){
			e.preventDefault();
			Youtube.player.stopVideo();
		});
		$("#btnPause").on("click",function(e){
			e.preventDefault();
			Youtube.player.pauseVideo();
		});
		$("#btnPlay").on("click",function(e){
			e.preventDefault();
			Youtube.player.playVideo();
		});
	}
	function changePlayerVideoYoutube(){
		console.log("change");
	}
	function changeQualityPlayerVideoYoutube(){
		console.log("change quality");
	}


	function errorPlayerVideoYoutube(){
		$('#playerContainer').html('ocurrio un error al consultar a la api de youtube, vuelve a intentarlo algun dia de este año.');
	}
	function errorListVideoYoutube(){
		$('#videoContainer').html('ocurrio un error al consultar a la api de youtube, vuelve a intentarlo algun dia de este año.');
	}
}

















/*


// al conectarse con youtube y dar permisos
function initConnectYoutube(){
		$('#connect').hide();
	    $('#datos').show();
		$('#imagen').attr('src',Youtube.dataUserYoutube.picture);
   		$('#id').html("id: "+Youtube.dataUserYoutube.id);
   		$('#nombre').html("nombre: "+Youtube.dataUserYoutube.name);
   		$('#correo').html("correo: "+Youtube.dataUserYoutube.email);
   		$('#token').html("access token: "+Youtube.tokenApiYoutube);

   		

		Youtube.channelsList();
}

*/


/*

// consulta a la api, en este caso la channels.list
  function getUserChannel() {
    // Also see: https://developers.google.com/youtube/v3/docs/channels/list
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

        var channelId = response.items[0].id;

        console.log(response);
      }
    });
  }

  // datos del usuario de gmail
  function getUserData(){
  	 var userInfo = gapi.client.oauth2.userinfo.get();

   		userInfo.execute(function(response) {
   			console.log(response);
   			$('#imagen').attr('src',response.picture);
   			$('#id').html("id: "+response.id);
   			$('#nombre').html("nombre: "+response.name);
   			$('#correo').html("correo: "+response.email);
   			$('#token').html("access token: "+tokenApiYoutube);
   			logOutYoutube();
   		})
   	}

*/