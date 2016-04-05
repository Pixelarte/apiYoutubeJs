var Youtube;

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
		Youtube.channelsList(2);
		Youtube.addEventlistener("listVideoYoutube",listVideoYoutube);
		Youtube.addEventlistener("errorListVideoYoutube",errorListVideoYoutube);
	});

	function listVideoYoutube(){
		try{
			$('#next').unbind("click",nextListVideo);
			$('#prev').unbind("click",prevListVideo);
		}catch(e){}

		$("#totalVideos").html("total de videos :"+Youtube.playlist.pageInfo.totalResults); //total videos

		$("#videoContainer").show();

		$.each(Youtube.playlist.items, function(index, item) { //recorremos la lista de videos
			var title = item.snippet.title;
	  		var videoId = item.snippet.resourceId.videoId;
	  		var thumbs = item.snippet.thumbnails.default.url;
	  		$('#videos').append('<p><img id="imagen" src="'+thumbs+'"></p><p><a target="_blank" href="https://www.youtube.com/watch?v='+videoId+'">' + title + '</a></p>');
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
	function nextListVideo(){
		$("#videos").html("");
		Youtube.channelsList(2,Youtube.playlist.nextPageToken);// llamo ala misma funcion de la lisata de videos pero le paso el token de la pagina siguiente
		
	}
	function prevListVideo(){
		$("#videos").html("");
		Youtube.channelsList(2,Youtube.playlist.prevPageToken);// llamo ala misma funcion de la lisata de videos pero le paso el token de la pagina anterior
		
	}
	


	function errorListVideoYoutube(){
		$('#videoContainer').html('no tienes videos subidos a tu canal');
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