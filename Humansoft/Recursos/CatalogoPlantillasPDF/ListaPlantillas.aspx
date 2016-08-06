<%@ Page Language="C#" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Plantillas PDF</title>
    <style>
        html,body{font-family:Arial;}
        a,a:visited,a:link{text-decoration:none;color:inherit;}
        h1{background:#5b9dcc;color:#fbfbfb;padding-left:50px;width:1200px;margin:0px auto;padding:20px;font-weight:normal;}
        ul.lista-plantillas{margin:auto;list-style:none;width:1200px;}
        ul.lista-plantillas li{width:230px;height:350px;margin:10px;float:left;background:#d1e9fa;color:#0d324b;position:relative;overflow:hidden;padding:20px;}
        ul.lista-plantillas li:hover a{height:350px;cursor:pointer;}
        ul.lista-plantillas li a{position:absolute;bottom:0px;display:block;height:50px;background:#5b9dcc;background:rgba(0,0,0,0.5);color:#fbfbfb;padding:20px;width:100%;margin:0px -20px 0px -20px;font-size:18px;}
    </style>
</head>
<body>
    <h1>Lista de plantillas PDF</h1>
    <ul class="lista-plantillas">
        <li style="background:#d1e9fa url(/Recursos/imagenes/vacaciones.png) center center no-repeat">
            <a href="/Recursos/CatalogoPlantillasPDF/NPlantillasPDF.pdf?op=SolicitudVacaciones" target="_blank">Solicitud de vacaciones</a>
        </li>
        <li><a href="/Recursos/N"></a></li>
        <li><a href="/Recursos/N"></a></li>
        <li><a href="/Recursos/N"></a></li>
        <li><a href="/Recursos/N"></a></li>
        <li><a href="/Recursos/N"></a></li>
        <li><a href="/Recursos/N"></a></li>
        <li><a href="/Recursos/N"></a></li>
    </ul>
</body>
</html>
