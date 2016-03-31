var Youtube;

window.onload = init;

function init()
{
	console.log("followMe @PixelarteCl");
	var scopeYoutube=[
	  'https://www.googleapis.com/auth/youtube',//api js youtube
	  'https://www.googleapis.com/auth/youtube.force-ssl',//Manage your YouTube account
	  'https://www.googleapis.com/auth/youtube.readonly',//View your YouTube account
	  'https://www.googleapis.com/auth/youtube.upload',//Manage your YouTube videos
	  'https://www.googleapis.com/auth/youtubepartner',//View and manage your assets and associated content on YouTube
	  'https://www.googleapis.com/auth/youtubepartner-channel-audit',//View private information of your YouTube channel relevant during the audit process with a YouTube partner
	  'https://www.googleapis.com/auth/userinfo.profile' //google plus

	];
	Youtube=new classApiYoutube('895438985752-u3ncu8isbo7r4udupdm523bblec4r2m5.apps.googleusercontent.com',scopeYoutube);
	Youtube.addEventlistener("EventConnectYoutube",initConnectYoutube);
	Youtube.addEventlistener("initButtonConnectYoutube",initButtonConnectYoutube);
	Youtube.addEventlistener("accessDeniedYoutube",accessDeniedYoutube);


}

function accessDeniedYoutube(){
	$("#denied").show();
	$('#connect').hide();
	$('#datos').hide();
	$('#reload').click(function() {
		location.reload();
	});
}

// funcion que llama la api de youtube al momento de cargar el js
function googleApiClientReady(){
	gapi.auth.init(function() {
   		window.setTimeout(Youtube.checkAuth, 1);
    });
}


function initButtonConnectYoutube(){
	$('#connect').show();
	$('#datos').hide();
	$('#connectYoutube').click(function() {
		Youtube.initConnectYoutube();
	});
}

// al conectarse con youtube y dar permisos
function initConnectYoutube(){
		$('#connect').hide();
	    $('#datos').show();
		$('#imagen').attr('src',Youtube.dataUserYoutube.picture);
   		$('#id').html("id: "+Youtube.dataUserYoutube.id);
   		$('#nombre').html("nombre: "+Youtube.dataUserYoutube.name);
   		$('#correo').html("correo: "+Youtube.dataUserYoutube.email);
   		$('#token').html("access token: "+Youtube.tokenApiYoutube);

   		// para deslogearse
   		$('#logOut').click(function() {
			$.ajax({
			  type: 'GET',
			  url: "https://accounts.google.com/o/oauth2/revoke?token="+Youtube.tokenApiYoutube,
			  async: false,
			  contentType: "application/json",
			  dataType: 'jsonp',
			  success: function(nullResponse) {
			     $('#connect').show();
	    		 $('#datos').hide();
			  },
			  error: function(e) {

			  }
			});
		});

		Youtube.channelsList();
}





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