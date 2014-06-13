var express = require('express'),
	http = require('http'),
	io = require('socket.io'),
	path = require('path'),
	fs = require('fs'),
	sizeOf = require('image-size');

var app = express(); 

app.use(express.static(path.join(__dirname, 'public'))); 
app.get('/', function(req, res){
	res.sendfile('index.html');
});

var server = http.createServer(app),
	io = io.listen(server); 

io.on('connection', function(socket) {

	socket.on('image_name', function(data) {

		var imagePath = "public/body_2/body_2_"+data+"_3_1.jpg";
		console.log('Recieved image name: '+imagePath);
		 // var imagePath = "public/images/"+data;

		sizeOf(imagePath, function(err, dimensions) {

			if (err) {
				console.log("Error getting image size...");
			} 
			else {
			  	fs.readFile(imagePath, function(err, buf) {

					if (err) {
						console.log("Error reading image file...");
					} 
					else {
						console.log('image sending');
						socket.emit('image', { buffer: buf, width: dimensions.width, height: dimensions.height });
					}
				});
		  	}
		});
	});
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});


