$('document').ready(function(){
	$('.create-patient').click(function(e){

		var dataJSON = {
			'firstname' : $('#firstname').value,
			'lastname' : $('#lastname').value,
			'email' : $('#email').value,
			'dob' : $('#dob').value
		};
		
		var url = 'http://cms.sols.co/api/consumer_create?callback=hello&format=jsonp';
	  $.ajax({ 
			url: url,
			data: dataJSON,
			dataType: "jsonp",
			success: function(data) {
				if(data.consumer_id){
					window['localStorage'].id = data.consumer_id;
					window.location.replace("create.html");
				}
			}
	  });
	});
});
