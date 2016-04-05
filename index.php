<!doctype html>
<html lang="es">
<head>
      <!--token para validar el dominio y la api de permisos para utilizar sus servicios-->
	<meta name="google-site-verification" content="msD4bz5NV6UoXOFpa3rf5FjzDh47hKmvL_aLfkKF0FE" />
  
</head>
<body>

<!--cuando se niega el acceso a los permisos o no dar connect-->
<div id="denied" style="display:none;">
	acceso denegado, recarga la pagina y da los permisos.
	 <a href="#" id="reload">Reload</a>
</div>

<!--boton connect-->
<div id="connect" style="display:none;">
      <a href="#" id="connectYoutube">Connect Youtube</a>
</div>

<!--boton cerrar sesion connect-->
<div id="sesion" style="display:none;">
      <p><a href="#" id="logOut">Cerrar Sesion</a></p>
      <p><a href="#" id="listaVideo">Lista Video</a></p>
</div>

<!--datos luego del connect, luego de dar los permisos-->
<div id="datos" style="display:none; ">
      <img id="imagen" src="" style="width:100px;">
      <p id="id"></p>
      <p id="nombre"></p>
      <p id="correo"></p>
      <p id="token"></p>
      <div id="videoContainer"><h1>Lista de Videos subidos:</h1></div>
</div>



<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="assets/js/main.min.js"></script>
<script src="assets/js/libs/classApiYoutube.min.js"></script>
<!--se llama a la api v3 esta al estar cargada llama a la funcion googleapiclientready qeu esta dentro de classApiYoutube.js-->
<script src="https://apis.google.com/js/client.js?onload=googleApiClientReady"></script>

</body>