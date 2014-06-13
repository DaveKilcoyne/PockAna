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

var rotation,
	quality;

io.on('connection', function(socket) {

	socket.on('image_name', function(data) {

		rotation = data.rot;
		quality = data.qual;

		//First Head part
		var imagePath = "public/body_2/body_2_"+rotation+"_"+quality+"_1.jpg";
		var imagePath2 = "public/body_2/body_2_"+rotation+"_3_1.jpg"; //Resize to max quality size
		// console.log('Recieved image name: '+imagePath);
		// var imagePath = "public/images/"+data;

		//Body part
		var imagePathBod = "public/body_2/body_2_"+rotation+"_"+quality+"_2.jpg";
		var imagePathBod2 = "public/body_2/body_2_"+rotation+"_3_2.jpg"; //Resize to max quality size

		var imagePathLegsU = "public/body_2/body_2_"+rotation+"_"+quality+"_3.jpg";
		var imagePathLegsU2 = "public/body_2/body_2_"+rotation+"_3_3.jpg"; //Resize to max quality size

		var imagePathLegsL = "public/body_2/body_2_"+rotation+"_"+quality+"_4.jpg";
		var imagePathLegsL2 = "public/body_2/body_2_"+rotation+"_3_4.jpg"; //Resize to max quality size

		imageTranfer( imagePath, imagePath2, 'head' );
		imageTranfer( imagePathBod, imagePathBod2, 'body' );
		imageTranfer( imagePathLegsU, imagePathLegsU2, 'legsU' );
		imageTranfer( imagePathLegsL, imagePathLegsL2, 'legsL' );

		function imageTranfer(imagePath, imagePath2, bodyPart) {

			sizeOf(imagePath2, function(err, dimensions) {

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
							socket.emit('image', { buffer: buf, width: dimensions.width, height: dimensions.height, bodyPart: bodyPart });
						}
					});
				}
			});
		}
		
	});
});




server.listen(3000, function(){
	console.log('listening on *:3000');
});


