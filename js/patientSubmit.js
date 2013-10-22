$('document').ready(function(){
	$('button').click(function(e){
		var dataJSON = {};
		var url = 'http://cms.sols.co/api/consumer_create?callback=hello&format=jsonp';
		var dataNodes = $('input');
		$.each(dataNodes, function(index, value){
			dataJSON[dataNodes[index].name] = dataNodes[index].value;
		});
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
