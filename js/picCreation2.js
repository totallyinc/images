$(document).ready(function(){
  var originalCaller = null;
  var img = null;
  $('#foot-pics img').click(function(e) {
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
      img = mediaFiles[0];
      uploadFiles();
      var imageElement = $(this);
      //imageElement.css('visibility',"visible");
     // imageElement.css("display","block");
      //imageElement.css("width","75px");
      imageElement.attr("src",img.fullPath);
      //originalCaller.parent().append(imageElement);
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
      path = img.fullPath;
      name = img.name;
      //navigator.notification.alert(window['localStorage'].id);
      ft.upload(path,
        "http://cms.Sols.co/api/create_order?order_id="+window['localStorage'].id+"&name="+originalCaller.attr("name"),
        function(result) {
          navigator.notification.alert('Response message: '+result.response);
          navigator.notification.alert('Upload success: ' + result.responseCode);
          navigator.notification.alert('bytes sent: ' + result.bytesSent);
          navigator.notification.alert('actual size: ' + medFiles[index].size);
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
    } catch(err){
      navigator.notification.alert("Exception: " + err);
    }
  }
});