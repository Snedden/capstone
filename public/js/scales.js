

function Scale(scaleId,pid,name,type,dataColId,width,bandPadding,rangeFrom,rangeTo){
	var brokenScaleName=name.split("__"); //pScales[i].name="datasetName_datacolumnName_scale";
	this.datasetName=brokenScaleName[0];
	this.colName=brokenScaleName[1];

	this.scaleId=scaleId;
	this.pid=pid;
	this.name=name;
	this.type=type;
	this.dataColId=dataColId;
	this.width=width;
	this.bandPadding=bandPadding;
	this.axes={};
	if(rangeFrom){
		this.rangeFrom=parseInt(rangeFrom);
	}
	//in case of ordinal scales
	else{
		this.rangeFrom=0;
	}
	if(rangeTo){
		this.rangeTo=parseInt(rangeTo);	
	}
	//in case of ordinal sclaes
	else{
		this.rangeTo=0;
	}
	

	this.dataCol=project.datasets[this.datasetName].dataCols[this.colName];
	console.log('scale', this);
	if(this.type==='Linear'){
		this.domainFrom=parseInt(d3.min(this.dataCol.data));
		this.domainTo=parseInt(d3.max(this.dataCol.data));

		
		this.d3ScaleLateral=d3.scaleLinear()
			.domain([this.domainFrom,this.domainTo])
			.range([this.rangeFrom, this.rangeTo]);
		
		//Y axis is inverted in svg
		this.d3ScaleVertical=d3.scaleLinear()
			.domain([this.domainFrom,this.domainTo])
			.range([this.rangeTo,this.rangeFrom]);
		
	}
	else if(this.type==='Ordinal'){
		this.domainOrdinal=this.dataCol.data;


		this.d3ScaleLateral=this.d3ScaleVertical=d3.scaleBand()
				.domain(this.domainOrdinal)
				.range([0,this.width])
				.padding(this.bandPadding);
	}
	else{
		console.error("Invalid scale type");
	}
	
	

    	
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
			//create scale object
			var scale=new Scale(data.id,data.pid,data.name,data.type,data.dataColId,data.width,data.padding,data.rangeFrom,data.rangeTo);
			scale.addScale();				//add to global object and screen
			$("#addScaleModal").modal('hide');//close modal dialog
		}
		else{
			console.error('Invalid return type for scale save function');
		}
}
//add scale end

//del scale
$(document).on('click','.scaleDelBtn',function(e){
	if( ! confirm("Delete scale? Deleting a scale would also delete associated entities") ){
           return false;
    }
	var scaleId=$(this).attr('data-scale-id');
	var scaleTobeDeleted='scale'+scaleId;
	project.scales[scaleTobeDeleted].deleteScale();



});


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

Scale.prototype={
	constructor:Scale,

	addScale:function(){ //scale is Scale object
		var scaleName="scale"+this.scaleId;
		//add to memory
		project.scales[scaleName]=this;
		//add to screen

		//scale  list in main screen
		var scaleLiM="<li class='scales' data-scale-id="+this.scaleId+" data-toggle='modal' data-action='update'  data-target='#addScaleModal' data-datasetcol-name="+this.colName+" data-dataset-name="+this.datasetName+".csv   id=scale"+this.scaleId+"Li>"+this.name+"<button style='float:right;font-size:9px'  class='btn btn-xs btn-primary scaleDelBtn'     data-scale-id="+this.scaleId+" data-scale-name="+this.name+">Delete</button> </li> ";
		$("#scaleUl").append(scaleLiM);
		//scale list in add scale modal
		var scaleOpA="<option id=scale"+this.scaleId+"Op value="+this.scaleId+">"+this.name+"</option>";
		$("#axesScale").append(scaleOpA);

		
		
		
	},

	deleteScale:function(){
	
		var scaleObject=this; //cache this as it is a lost in the call back funciton call
		var axisId,axisToBeDeleted;
		ajaxCall('post','scale/delete',this.scaleId,'text',scaleDelCallback);

		function scaleDelCallback(data){
		
		    var scaleTobeDeleted='scale'+scaleObject.scaleId;
		    //delete form screen
		    $("#"+scaleTobeDeleted+'Li').remove(); //list item
		    $("#"+scaleTobeDeleted+'Op').remove(); //add scale option
		 	//delete from memory

		 	//delte all associate axis
		 	for(var key in project.scales[scaleTobeDeleted].axes){
     			axisId=project.scales[scaleTobeDeleted].axes[key].id;
     			axisToBeDeleted="axes"+axisId;
     			project.axes[axisToBeDeleted].deleteAxes(true);
			}
		 	//delete scale object
		    delete project.scales[scaleTobeDeleted];

		    //delet
		}
	}
}