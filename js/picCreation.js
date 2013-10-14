var medFiles;
function invoke(){
    try{
    	navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
    }
    catch(err){
        navigator.notification.alert("An error occurred during capture: " + err, null, "Uh oh!");
    }
}

function captureSuccess(mediaFiles){
    try{
        navigator.notification.alert("Message: " , null, "Beginning captureSuccess!");
        var img = mediaFiles[0];
    	medFiles.append(img);
    	var imageContainer = event.target.parentElement;
    	var imageElement = document.createElement("img");
        imageElement.src = "data:image/jpeg;base64," + img.fullPath;
        navigator.notification.alert(imageElement.src);
    	imageContainer.appendChild(imageElement);
        navigator.notification.alert("Message: " , null, "Ending captureSuccess!");
    }
    catch(err){
        navigator.notification.alert(err);
    }
}

function captureError(error){
	var msg = "An error occurred during capture: " + error.code;
	navigator.notification.alert(msg, null, "Uh oh!");
}

function uploadFile() {
    var ft = new FileTransfer(),
    path = medFile.fullPath,
    name = medFile.name;

    ft.upload(path,
        "http://my.domain.com/upload.php",
        function(result) {
            console.log('Upload success: ' + result.responseCode);
            console.log(result.bytesSent + ' bytes sent');

        },
        function(error) {
            console.log('Error uploading file ' + path + ': ' + error.code);
        },
        { fileName: name }
    ); 
}