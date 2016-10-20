

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



//Event listeners
//add scale modle open
//triggered when modal is about to be shown
$('#addScaleModal').on('show.bs.modal', function(e) {

    var action = $(e.relatedTarget).data('action');
    
    //get data-id attribute of the clicked element
    var datasetName = $(e.relatedTarget).data('dataset-name');


    datasetName=datasetName.slice(0,-4); //ignore csv
    var datasetCol = $(e.relatedTarget).data('datasetcol-name');
    var dataColId=$(e.relatedTarget).attr("id");
    var datasetColObj=project.datasets[datasetName].dataCols[datasetCol];
    var scaleType=(datasetColObj.type==="Number"?"Linear":"Ordinal");
    var scaleName=datasetName+"__"+datasetColObj.name+"__scale"; //two underscore as delimeters to mitigate just incase if column name have underscores
    var ordinalDomain="";

    var scaleId,scaleName,scaleObj,rangeFrom,rangeTo,width,padding;

    var ordinalRangeInput=document.getElementById('scaleBandPaddingOrdinal');
    setOutput(ordinalRangeInput,'scaleBandPaddingOrdinalOutput'); //set default to 0.1

    //toggle inputs based on input types
    if(scaleType==="Linear"){
    	$(".linearScaleInput").show();
    	$(".ordinalScaleInput").hide();
    }
    else if(scaleType==="Ordinal"){
    	$(".linearScaleInput").hide();
    	$(".ordinalScaleInput").show();

    	for(var i=0;i<datasetColObj.data.length;i++){
    		ordinalDomain=ordinalDomain+datasetColObj.data[i]+",";
    	}
    }
    //add or update scale
    if(action==="add"){
      //enable them back
      $(e.currentTarget).find("#addScaleBtn").prop("disabled",false);
      $(e.currentTarget).find("#range_from").prop("disabled",false);
      $(e.currentTarget).find("#range_to").prop("disabled",false);
      $(e.currentTarget).find("#scaleBandPaddingOrdinal").prop("disabled",false);
      $(e.currentTarget).find("#scaleWidthOrdinal").prop("disabled",false);

      $(e.currentTarget).find("#addScaleBtn").html("Add");
    }
    else if(action==="update"){
      //disable them for now
      $(e.currentTarget).find("#addScaleBtn").prop("disabled",true);
      $(e.currentTarget).find("#range_from").prop("disabled",true);
      $(e.currentTarget).find("#range_to").prop("disabled",true);
      $(e.currentTarget).find("#scaleBandPaddingOrdinal").prop("disabled",true);
      $(e.currentTarget).find("#scaleWidthOrdinal").prop("disabled",true);

      scaleId=$(e.relatedTarget).data('scale-id');
      scaleName="scale"+scaleId;
      scaleObj=project.scales[scaleName];
      if(scaleType==="Linear"){
        $(e.currentTarget).find("#range_from").val(scaleObj.rangeFrom);
        $(e.currentTarget).find("#range_from").val(scaleObj.rangeFrom);
      }
      else if(scaleType==="Ordinal"){
        $(e.currentTarget).find("#scaleWidthOrdinal").val(scaleObj.width);
        $(e.currentTarget).find("#scaleBandPaddingOrdinal").val(scaleObj.padding);
      }
      
      
      $(e.currentTarget).find("#addScaleBtn").html("Update");




    }
    else{
      console.error("invalid action type in addScaleModal");
    }
    
    //populate the textbox
    $(e.currentTarget).find('#dataScaleName').val(scaleName);
    $(e.currentTarget).find('#dataColType').val(scaleType);
    $(e.currentTarget).find('#dataColDomainFrom').val(d3.min(datasetColObj.data));
    $(e.currentTarget).find('#dataColDomainTo').val(d3.max(datasetColObj.data));
    $(e.currentTarget).find('#dataColId').val(dataColId);
    $(e.currentTarget).find('#domainOrdinal').val(ordinalDomain);
    

    
   
});

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