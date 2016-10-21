function Rectangle(){

}

function setOutputOpacity(rangeInput){
	var rangeInputEle=$(rangeInput);
	var rangeOutputEle=$("#scaleBandPaddingOrdinalOutput");
	var outputRange=((parseInt(rangeInputEle.val())*0.01)).toFixed(2);
	rangeOutputEle.val(outputRange);
}

//event listeners
//add rect modle open
//triggered when modal is about to be shown
$('#addRectModal').on('show.bs.modal', function(e) {
	console.log('rect');
});

//add to shared users from userslist
$(document).on('change', '#rectDataset', function() {
	var selectedDataset=$(this);
    
	//console.log('rectDs',selectedDataset.val(), selectedDataset);

	//if no dataset selected toggle
	if(selectedDataset.val()===""){
		
		$(".rectSelect").hide();
	}
	else{
		ajaxCall('get','dataset/axis/'+selectedDataset.val(),'','json',getAxesCallback);
		$(".rectSelect").show();
	}

	function getAxesCallback(data){
		//remove previous
		$('.rectAxisSelect').html('');

		//add new
		for(var i=0;i<data.length;i++){
			//add header once
			if(i===0){
				$('.rectAxisSelect').append($('<option>', { 
			        value: -1,
			        text : 'No axis' 
			    }));
			}
		    $('.rectAxisSelect').append($('<option>', { 
		        value: data[i].idaxes,
		        text : data[i].name 
		    }));

		}
	}
}); 