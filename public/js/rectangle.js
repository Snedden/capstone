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
    
	console.log('rectDs',selectedDataset.val(), selectedDataset);
}); 