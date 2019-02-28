$(document).ready(function(){
	 function getCookie(name) {
	     var cookieValue = null;
	     if (document.cookie && document.cookie !== '') {
		 var cookies = document.cookie.split(';');
		 for (var i = 0; i < cookies.length; i++) {
		     var cookie = jQuery.trim(cookies[i]);
		     // Does this cookie string begin with the name we want?
				  if (cookie.substring(0, name.length + 1) === (name + '=')) {
				      cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				      break;
				  }
		 }
	     }
	     return cookieValue;
	 }
    var csrftoken = getCookie('csrftoken');
    $('.ui.warning').css("display", 'none');
    $('#explorer_import_form').on('submit',function(event){
	event.preventDefault();
	var ExplorerForm = document.getElementById('explorer_import_form');
	var ExplorerDataForm = new FormData(this);
	$.ajax({
	    url: ExplorerForm.getAttribute('action'),
	    type: ExplorerForm.getAttribute('method'),
	    data: ExplorerDataForm,
	    processData: false,
	    contentType: false,
	    beforeSend: function(xhr, settings){
		xhr.setRequestHeader("X-CSRFToken", csrftoken);
		$(".loader").css("display", "block");
	    },
	    success: function(data){
		if (data['status'] == 'ok'){
		    console.log("Dataset has been imported");
		    $(".ui.positive").css("display", 'block');
		}
		else{
		    console.log("Error Uploading Partner Sheet");
		    $(".ui.negative").css("display", 'block');
		    $('#errorDetail').html(data['form']);
		}
	    },
	    complete: function(data){
		$(".loader").css("display", "none");
	    },
	    error: function(xhr,message, error){
		console.log(xhr.status +  " : "+ xhr.responseText);
		$('.ui.negative').css("display", 'block');
		$('#errorDetail').html(xhr.status +  " : "+ xhr.responseText);
	    },
	    
	}); 
    });
});
