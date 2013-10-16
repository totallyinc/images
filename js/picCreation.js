var medFiles = [];
function invoke(num) {
    try {
        navigator.device.capture.captureImage(captureSuccess(num), captureError, {limit: 1});
    } catch (err) {
        navigator.notification.alert("An error occurred during capture: " + err, null, "Uh oh!");
    }
}

function captureSuccess(mediaFiles) {
    try {
        var img = mediaFiles[0];
    	medFiles[num] = img;
        //navigator.notification.alert("Pushed image to list");
    	var imageContainer = document.getElementById('imageContainer');
        var imageElement = document.createElement("img");
        imageElement.style.visibility = "visible";
        imageElement.style.display = "block";
        imageElement.style.width = "500px";
        imageElement.src = img.fullPath;
        imageContainer.appendChild(imageElement);
        var upload = document.getElementById('upload');
        if (upload.innerHTML === "" || upload.innerHTML ===   undefined) {
           // navigator.notification.alert('in add button block');
            upload.innerHTML = '<button onclick="uploadFiles()">Upload pictures</button>';
        }
    } catch (err) {
        navigator.notification.alert("Error: " + err);
    }
}

function captureError(error) {
	var msg = "An error occurred during capture: " + error.code;
	navigator.notification.alert(msg, null, "Uh oh!");
}

function uploadFiles() {
    try {
        var ft = new FileTransfer();
        for (var index in medFiles){
            path = medFiles[index].fullPath;
            name = medFiles[index].name;

            ft.upload(path,
                "http://cms.Sols.co/api/create_order",
                function(result) {
                    navigator.notification.alert('Upload success: ' + result.responseCode);
                    navigator.notification.alert('bytes sent: ' + result.bytesSent);
                    navigator.notification.alert('actual size: ' + medFiles[index].size);

                },
                function(error) {
                    navigator.notification.alert('Error uploading file ' + path + ': ' + error.code);
                },
                { fileName: name }
            );
        } 
    } catch(err){
        navigator.notification.alert("Exception: " + err);
    }
}