$(document).ready(function(){
  var medFiles = [];
  var originalCaller = null;

  $('button').click(function(e) {
    try {
      //navigator.notification.alert(num);
      originalCaller = $(this);
      navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
    } catch (err) {
      navigator.notification.alert("An error occurred during capture: " + err, null, "Uh oh!");
    }
  });

  function captureSuccess(mediaFiles) {
    try {
      var img = mediaFiles[0];
      medFiles.push = img;
      uploadFiles();
      var imageContainer = $('body');
      for(var medKey in medFiles){
        var imageElement = document.createElement("img");
        imageElement.style.visibility = "visible";
        imageElement.style.display = "block";
        imageElement.style.width = "500px";
        imageElement.src = medFiles[medKey].fullPath;
        originalCaller.parent().append(imageElement);
      }
      var upload = document.getElementById('upload');
    } catch (err) {
      navigator.notification.alert("Error: " + err);
    }
  }

  function captureError(error) {
    var msg = "An error occurred during capture: " + error;
    navigator.notification.alert(msg, null, "Uh oh!");
  }

  function uploadFiles() {
    try {
      var ft = new FileTransfer();
      for (var index in medFiles){
        path = medFiles[index].fullPath;
        name = medFiles[index].name;
        navigator.notification.alert(window['localStorage'].id);
        ft.upload(path,
          "http://cms.Sols.co/api/create_order?order_id="+window['localStorage'].id,
          function(result) {
            navigator.notification.alert('Upload success: ' + result.responseCode);
            navigator.notification.alert('bytes sent: ' + result.bytesSent);
            navigator.notification.alert('actual size: ' + medFiles[index].size);
            navigator.notification.alert('Response message: '+result.response);
          },
          function(error) {
            navigator.notification.alert('Error uploading file ' + path + ': ' + error);
          },
          { 
            fileKey : 'f1',
            params:{
              'shoe_size':'1'
            }
          }
        );
      } 
    } catch(err){
      navigator.notification.alert("Exception: " + err);
    }
  }
});