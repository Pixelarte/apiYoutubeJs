<!doctype html>
<html lang="es">
<head>

	<meta name="google-site-verification" content="msD4bz5NV6UoXOFpa3rf5FjzDh47hKmvL_aLfkKF0FE" />
  
</head>
<body>
<div id="denied" style="display:none;">
	acceso denegado, recarga la pagina y da los permisos.
	 <a href="#" id="reload">Reload</a>
</div>
<div id="connect" style="display:none;">
      <a href="#" id="connectYoutube">Connect Youtube</a>
</div>
<div id="datos" style="display:none; ">
      <img id="imagen" src="" style="width:100px;">
      <p><a href="#" id="logOut">Cerrar Sesion</a></p>
      <p id="id"></p>
      <p id="nombre"></p>
      <p id="correo"></p>
      <p id="token"></p>
      <div id="videoContainer"><h1>Lista de Videos subidos:</h1></div>
</div>



<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/libs/classApiYoutube.js"></script>
<script src="https://apis.google.com/js/client.js?onload=googleApiClientReady"></script>

</body>