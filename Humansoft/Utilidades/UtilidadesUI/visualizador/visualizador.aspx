<%@ Page Language="C#" AutoEventWireup="true" %>

<!DOCTYPE html>
<%
    string imageURI = string.Empty;
    string[] ext = {};
    try
    {
        imageURI = Server.UrlDecode(Request["urlImagen"].ToString());
        ext = imageURI.Split('.');
        if (!(ext[ext.Count() - 1].Equals("gif") || ext[ext.Count() - 1].Equals("jpeg") || ext[ext.Count() - 1].Equals("jpg") || ext[ext.Count() - 1].Equals("png")))
        {
            Response.Redirect(imageURI);
        }
    }
    catch { imageURI = "Empty"; }        
%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
    <title>Visializador de Imagenes</title>

    <script type="text/javascript" src="jquery.js"></script>

    <script type="text/javascript" src="jqueryui.js"></script>

    <script type="text/javascript" src="jquery.mousewheel.min.js"></script>

    <script type="text/javascript" src="jquery.iviewer.js"></script>

    <script type="text/javascript">
        var $ = jQuery;
        $(document).ready(function(){
                var iv1 = $("#viewer").iviewer({
                    src: "images.png",
                    update_on_resize: false,
                    zoom_animation: false,
                    mousewheel: false,
                    onMouseMove: function(ev, coords) { },
                    onStartDrag: function(ev, coords) { return false; }, //this image will not be dragged
                    onDrag: function(ev, coords) { }
                });

                $("#in").click(function(){ iv1.iviewer('zoom_by', 1); });
                $("#out").click(function(){ iv1.iviewer('zoom_by', -1); });
                $("#fit").click(function(){ iv1.iviewer('fit'); });
                $("#orig").click(function(){ iv1.iviewer('set_zoom', 100); });
                $("#update").click(function() { iv1.iviewer('update_container_info'); });
                var imageUrl="<%= imageURI %>";
                imageExists(imageUrl, function(exists) {
                if (exists){
                    var iv2 = $("#viewer2").iviewer(
                    {
                        src:imageUrl
                    });
                    $("#viewer2").css("background-color","White");
                }
                });
            });

        function imageExists(url, callback) {
			var img = new Image();
			img.onload = function() { callback(true); };
			img.onerror = function() { callback(false); };
			img.src = url;
		}
    </script>

    <link rel="stylesheet" href="jquery.iviewer.css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <style>
        .viewer
        {
            height: 600px;
            position: relative;
            margin: auto;
        }
        .wrapper
        {
            overflow: hidden;
        }
        body
        {
            line-height: 120%;
            font-family: verdana, arial, helvetica;
            color: #2d3f05;
            font-size: 11px;
            font-weight: normal;
            text-decoration: none;
        }
        div#Fondo
        {
            background-color: #FFF; /*#F9FFD7*/
            margin: auto;
            width: 95%;
            text-align: center;
            border: solid 10px #BEDEF4;
        }
        div#Cuerpo
        {
            margin: 10px;
            padding: auto;
            background: #FFF;
            background-image: url("images.png");
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-position: center;
        }
    </style>
    
</head>
<body style="margin: 0px;">
    <div id="Fondo">
        <div id="Cuerpo" class="scrollable">
            <div id="viewer2" class="viewer" style="width: 100%;">
            </div>
        </div>
    </div>
</body>
</html>
