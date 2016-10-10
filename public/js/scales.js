

function Scale(scaleId,pid,name,type,dataColId,width,bandPadding,rangeFrom,rangeTo){
	this.scaleId=scaleId;
	this.pid=pid;
	this.name=name;
	this.type=type;
	this.dataColId=dataColId;
	this.width=width;
	this.bandPadding=bandPadding;
	this.rangeFrom=rangeFrom;
	this.rangeTo=rangeTo;
	this.domainOrdinal;
	this.domainFrom;
	this.domainTo;

    	
}

//add scale
$("#scaleForm").submit(function(e){
	
	var scaleName=$("#dataScaleName").val();
	var scaleType=$("#dataColtype").val();
	var dataColId=$("#dataColId").val();
	var scaleWidth=$("#scaleWidthOrdinal").val();
	var bandPadding=$("#scaleBandPaddingOrdinalOutput").val();
	var scaleData;
	if(scaleType==="Linear"){
		scaleData={
			pid:project.pid,
			name:scaleName,
			type:scaleType,
			dataColId:dataColId,
			rangeFrom:$("#range_from").val(),
			rangeTo:$("#range_to").val()
		};
	}
	else if(scaleType==="Ordinal"){
		scaleData={
			pid:project.pid,
			name:scaleName,
			type:scaleType,
			dataColId:dataColId,
			width:scaleWidth,
			padding:bandPadding
		};
		
	}
	else{
		console.error("unexpected scale type");
	}
	
	
	e.preventDefault();
	e.stopImmediatePropagation();
	ajaxCall('post','scale/create',scaleData,'json',scaleAddCallback); 
	

});

function scaleAddCallback(data){
		console.log("scale callback ",data);
		if(data.type==="error"){
			$("#ajaxFeedback").html(data.message);

		}
		else if(data.type==="Ordinal" || data.type==="Linear"){
			

			//add to memory
			var brokenScaleName=data.name.split("_"); //data.name="datasetName_datacolumnName_scale";
			var datasetName=brokenScaleName[0];
			var colName=brokenScaleName[1];

			var scale=new Scale(data.id,data.pid,data.name,data.type,data.dataColId,data.width,data.padding,data.rangeFrom,data.rangeTo);
			project.datasets[datasetName].dataCols[colName].addScale(scale);//add to global object
			console.log('scale ', project);

			//add to screen
			var scaleLi="<li class='scales' id=scale"+data.id+">"+data.name+"<button style='float:right;font-size:9px'  class='btn btn-xs btn-primary scaleDelBtn'    data-scale-id="+data.id+" data-scale-name="+data.name+">Delete</button> </li> ";
			$("#scaleUl").append(scaleLi);
			$("#addScaleModal").modal('hide');
		}
		else{
			console.error('Invalid return type for scale save function');
		}
}
//add scale end

//del scale
$(document).on('click','.scaleDelBtn',function(e){

	console.log('ee ',$(this).attr('data-scale-id'));
	var scaleId=$(this).attr('data-scale-id');
	var scaleName=$(this).attr('data-scale-name');
	var brokenScaleName=scaleName.split("_"); //data.name="datasetName_datacolumnName_scale";
	var datasetName=brokenScaleName[0];
	var colName=brokenScaleName[1];

	var scaleData={
		id:scaleId,
		name:scaleName,
		dataset:datasetName,
		dataCol:colName
	}

	ajaxCall('post','scale/delete',scaleData,'json',scaleDelCallback);

});

function scaleDelCallback(data){
	console.log('del callback ',data);
	var deletedScaleId="scale"+data.id; //dom id and memory id is of format 'scale'+id 
	//delete from screen
    $("#"+deletedScaleId).remove();
    //delete from memory
    delete project.datasets[data.dataset].dataCols[data.dataCol][deletedScaleId];
}
//del scale end
function validateRangeTo(input){

	var rangeFrom=$("#range_from");
	var rangeTo=$(input);
	var rangeFromVal=parseInt(rangeFrom.val());
	var rangeToVal=parseInt(rangeTo.val());
	console.log(rangeFromVal,'>',rangeToVal,' ',rangeFromVal>rangeToVal);
	if(rangeFromVal>rangeToVal){
		console.log("trying");
		input.setCustomValidity('Range to should be greater than Range from');	
		return false;
	}
	else{
		console.log("trying to set valid");
		input.setCustomValidity('');	
		return true;
	}
	
}

function setOutputBandpadding(rangeInput){
	var rangeInputEle=$(rangeInput);
	var rangeOutputEle=$("#scaleBandPaddingOrdinalOutput");
	var outputRange=((parseInt(rangeInputEle.val())*0.01)).toFixed(2);
	rangeOutputEle.val(outputRange);
}