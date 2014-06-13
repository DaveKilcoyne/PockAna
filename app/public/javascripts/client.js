$(function() {

    var canvas = document.getElementById('can');
    canvas.width = 1760;
    canvas.height = 5100;
    var ctx = canvas.getContext('2d');  

    var head_X_Position = 0;
    var body_X_Position = 0;
    var legsU_X_Position = 0;
    var legL_X_Position = 0;

    var canvasHeightHead = 0;
    var canvasWidthHead = 0;
    var canvasHeightBody = 0;
    var canvasWidthBody = 0;
    var canvasHeightLegsU = 0;
    var canvasWidthLegsU = 0;
    var canvasHeightLegsL = 0;
    var canvasWidthLegsL = 0;

    var bodyPart = '';

    var imageHead = new Image();
    var imagebody = new Image();
    var imageLegU = new Image();
    var imageLegL = new Image();


    var socket = io.connect();

    imageHead.onload = function() {  
        ctx.clearRect(0, 0, 1760, canvasHeightHead);   
        ctx.drawImage(this, head_X_Position, 0, canvasWidthHead, canvasHeightHead);
    }

    imagebody.onload = function() {
        ctx.clearRect(0, 1280, 1760, canvasHeightBody); 
        ctx.drawImage(this, body_X_Position, 1280, canvasWidthBody, canvasHeightBody);
    }

    imageLegU.onload = function() {  
        ctx.clearRect(0, 2560, 1760, canvasHeightLegsU);   
        ctx.drawImage(this, legsU_X_Position, 2560, canvasWidthLegsU, canvasHeightLegsU);
    }

    imageLegL.onload = function() {  
        ctx.clearRect(0, 3840, 1760, canvasHeightLegsL);   
        ctx.drawImage(this, legL_X_Position, 3840, canvasWidthLegsL, canvasHeightLegsL);
    }

    socket.on('connect', function() {   

        socket.emit('image_name', { rot: 1, qual: 3});
    });

    socket.on('image', function(data) {

        console.log(data);
        bodyPart = data.bodyPart;

        if (bodyPart == 'head') {
            canvasHeightHead = data.height;
            canvasWidthHead = data.width;
            head_X_Position = (1760 - canvasWidthHead)/2;
            base64String =  base64ArrayBuffer(data.buffer);
            imageHead.src = 'data:image/jpg;base64,' + base64String; 
        }
        else if (bodyPart == 'body') {
            canvasHeightBody = data.height
            canvasWidthBody = data.width;
            body_X_Position = (1760 - canvasWidthBody)/2;
            base64String =  base64ArrayBuffer(data.buffer);
            imagebody.src = 'data:image/jpg;base64,' + base64String; 
        }  
        else if (bodyPart == 'legsU') {
            canvasHeightLegsU = data.height
            canvasWidthLegsU = data.width;
            legsU_X_Position = (1760 - canvasWidthLegsU)/2;
            base64String =  base64ArrayBuffer(data.buffer);
            imageLegU.src = 'data:image/jpg;base64,' + base64String; 
        }  
        else if (bodyPart == 'legsL') {
            canvasHeightLegsL = data.height
            canvasWidthLegsL = data.width;
            legL_X_Position = (1760 - canvasWidthLegsL)/2;
            base64String =  base64ArrayBuffer(data.buffer);
            imageLegL.src = 'data:image/jpg;base64,' + base64String; 
        }

    });

    $( "#slider" ).slider({
        min: 1,
        max: 44,
        range: "min",
        value: 0,
        slide: function( event, ui ) {
            console.log('sliderValue: ' + ui.value); 
            socket.emit('image_name', { rot: ui.value, qual: 1});
        },
        change: function( event, ui ) {
            console.log(event);
            socket.emit('image_name', { rot: ui.value, qual: 3});
        }
    });



    // Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
    // use window.btoa' step. According to my tests, this appears to be a faster approach:
    // http://jsperf.com/encoding-xhr-image-data/5

    function base64ArrayBuffer(arrayBuffer) {

        var base64    = ''
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

        var bytes         = new Uint8Array(arrayBuffer)
        var byteLength    = bytes.byteLength
        var byteRemainder = byteLength % 3
        var mainLength    = byteLength - byteRemainder

        var a, b, c, d
        var chunk

        // Main loop deals with bytes in chunks of 3
        for (var i = 0; i < mainLength; i = i + 3) {
            // Combine the three bytes into a single integer
            chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

            // Use bitmasks to extract 6-bit segments from the triplet
            a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
            b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
            c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
            d = chunk & 63               // 63       = 2^6 - 1

            // Convert the raw binary segments to the appropriate ASCII encoding
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
            chunk = bytes[mainLength]

            a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

            // Set the 4 least significant bits to zero
            b = (chunk & 3)   << 4 // 3   = 2^2 - 1

            base64 += encodings[a] + encodings[b] + '=='
        } else if (byteRemainder == 2) {
            chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

            a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
            b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

            // Set the 2 least significant bits to zero
            c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

            base64 += encodings[a] + encodings[b] + encodings[c] + '='
        }
          
            return base64
        }


    function arrayBufferToBase64( buffer ) {
        var binary = ''
        var bytes = new Uint8Array( buffer )
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] )
        }
        return window.btoa( binary );
    }

});