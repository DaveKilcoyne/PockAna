var express = require('express'),
	http = require('http'),
	io = require('socket.io'),
	path = require('path'),
	fs = require('fs'),
	sizeOf = require('image-size');

var app = express(); 

app.use(express.static(path.join(__dirname, 'public'))); 
app.get('/', function(req, res){
	res.sendfile('indexold.html');
});

var server = http.createServer(app),
	io = io.listen(server); 

var rotation;
var	quality;
// var completeBodyObj = {};

io.on('connection', function(socket) {

	socket.on('image_name', function(data) {

		rotation = data.rot;
		quality = data.qual;

		//First Head part
		var imagePathHead = "public/body_2/body_2_"+rotation+"_"+quality+"_1.jpg";
		var imagePathHead_HQ = "public/body_2/body_2_"+rotation+"_3_1.jpg"; //Resize to max quality size

		//Body part
		var imagePathBod = "public/body_2/body_2_"+rotation+"_"+quality+"_2.jpg";
		var imagePathBod_HQ = "public/body_2/body_2_"+rotation+"_3_2.jpg"; //Resize to max quality size

		var imagePathLegsU = "public/body_2/body_2_"+rotation+"_"+quality+"_3.jpg";
		var imagePathLegsU_HQ = "public/body_2/body_2_"+rotation+"_3_3.jpg"; //Resize to max quality size

		var imagePathLegsL = "public/body_2/body_2_"+rotation+"_"+quality+"_4.jpg";
		var imagePathLegsL_HQ = "public/body_2/body_2_"+rotation+"_3_4.jpg"; //Resize to max quality size

		imageTranfer( imagePathHead, imagePathHead_HQ, 'head' );
		imageTranfer( imagePathBod, imagePathBod_HQ, 'body' );
		imageTranfer( imagePathLegsU, imagePathLegsU_HQ, 'legsU' );
		imageTranfer( imagePathLegsL, imagePathLegsL_HQ, 'legsL' );
		// socket.emit('image', completeBodyObj);
						

		function imageTranfer(imagePath, imagePath_HQ, bodyPart) {

			sizeOf(imagePath_HQ, function(err, dimensions) {

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
							// completeBodyObj[bodyPart]= { buffer: buf, width: dimensions.width, height: dimensions.height, bodyPart: bodyPart };
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


