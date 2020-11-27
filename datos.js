const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');
const { info } = require('console');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

const servidor=http.createServer((pedido ,respuesta) => {
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});
var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});


function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/recuperardatos': {
      
      recuperar(pedido,respuesta);
      break;
    }	
    default : {  
      fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino,(error, contenido) => {
          if (error) {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } else {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } else {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}


function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=
        `<!doctype html>
        <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="assets/css/bootstrap.min.css" type="text/css" media="screen" title="no title">
 
<link rel="stylesheet" href="assets/css/footer.css" type="text/css" media="screen" title="no title" >


  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script></head>
        
        <body>
        <center>
        <H3>El resultado es:</H3>
          <script type="text/javascript">
          
        var linea = "";
        var i=1;
        var numero=${formulario['numero']};
        var numero=numero*2;
        while(i<=numero){
          if(i%2){
            linea=linea+"*";
        }else{
          linea=linea+"o"
        }
        if(i%2){
        document.write(linea+"<br>");
        }
            i++;
        }

        document.write("<br>"+numero+"<br>");
        
        </script>
        </center>
        </body>
        </html>`;
    respuesta.end(pagina);
  });	
}
console.log(info);
console.log('Servidor web iniciado');