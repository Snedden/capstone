

function Scale(scaleId,pid,name,type,dataColId,width,bandPadding,rangeFrom,rangeTo){
	var brokenScaleName=name.split("__"); //pScales[i].name="datasetName_datacolumnName_scale";
	this.datasetName=brokenScaleName[0];
	this.colName=brokenScaleName[1];
	var dataColName='dataCol'+dataColId;

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
	

	this.dataCol=project.dataCols[dataColName];
	this.setScales();

}

//add scale
$("#scaleForm").submit(function(e){
	var action=$("#addScaleBtn").html();

	var scaleName=$("#dataScaleName").val();
	var scaleType=$("#dataColtype").val();
	var dataColId=$("#dataColId").val();
	var scaleWidth=$("#scaleWidthOrdinal").val();
	var bandPadding=$("#scaleBandPaddingOrdinalOutput").val();
	var scaleId=$("#scaleId").val();
	var scaleData={
			id:scaleId,
			pid:project.pid,
			name:scaleName,
			type:scaleType,
			dataColId:dataColId,
			};
	if(scaleType==="Linear"){
		scaleData.rangeFrom=$("#range_from").val();
		scaleData.rangeTo=$("#range_to").val();
		
	}
	else if(scaleType==="Ordinal"){
		scaleData.width=scaleWidth;
		scaleData.padding=bandPadding;
	}
	else{
		console.error("unexpected scale type");
	}
	
	
	e.preventDefault();
	e.stopImmediatePropagation();
	if(action==="Add"){
		ajaxCall('post','scale/create',scaleData,'json',scaleAddCallback);

	}
	else if(action==="Update"){
		console.log(action);
		ajaxCall('post','scale/update',scaleData,'json',scaleUpdateCallback);
	}
	else{
		console.error('Invalid action type ',action);
	}
	ajaxCall('post','projects/update/'+project.pid,'text',updateProjectCallback); //update project 
	 
	

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

function scaleUpdateCallback(data){
		var scaleName='scale'+data.id;
		project.scales[scaleName].updateScale(data);				//update to global object and screen
		$("#addScaleModal").modal('hide');//close modal dialog
}

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
    




    var datasetCol = $(e.relatedTarget).data('datasetcol-name');
    var dataColId=$(e.relatedTarget).data("col-id");
  
    var dataColName='dataCol'+dataColId;
    var datasetColObj=project.dataCols[dataColName];
    var scaleType=(datasetColObj.type==="Number"?"Linear":"Ordinal");
    var scaleName=datasetColObj.name+"__scale"; //two underscore as delimeters to mitigate just incase if column name have underscores
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
		$(e.currentTarget).find("#addScaleBtn").html("Add");
    }
    else if(action==="update"){

		scaleId=$(e.relatedTarget).data('scale-id');
      	scaleName="scale"+scaleId;
      	scaleObj=project.scales[scaleName];
	      if(scaleObj.type==="Linear"){
	        $(e.currentTarget).find("#range_from").val(scaleObj.rangeFrom);
	        $(e.currentTarget).find("#range_from").val(scaleObj.rangeFrom);
	      }
	      else if(scaleObj.type==="Ordinal"){
	        $(e.currentTarget).find("#scaleWidthOrdinal").val(scaleObj.width);
	        $(e.currentTarget).find("#scaleBandPaddingOrdinal").val(scaleObj.padding);
	      }
      
      	$(e.currentTarget).find("#addScaleBtn").html("Update");
      	$(e.currentTarget).find("#scaleBandPaddingOrdinal").val(scaleObj.bandPadding*100);
    	$(e.currentTarget).find("#scaleBandPaddingOrdinalOutput").val(scaleObj.bandPadding);
    	$(e.currentTarget).find("#scaleId").val(scaleId);

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
		var addEntityhelper;    //add entity helper once a scale is added to your project
		//add to memory
		project.scales[scaleName]=this;

		//add to screen
		//scale  list in main screen
		var scaleLiM="<div id=scale"+this.scaleId+"Li><li style='width:125px;overflow:hidden'  class='scales listItem' data-col-id="+this.dataColId+" data-scale-id="+this.scaleId+" data-toggle='modal' data-action='update'  data-target='#addScaleModal' data-datasetcol-name="+this.colName+" data-dataset-name="+this.datasetName+".csv   >"+this.name+"</li> <button style='float:right;font-size:9px'  class='btn btn-xs btn-primary scaleDelBtn'  data-col-id="+this.dataColId+"    data-scale-id="+this.scaleId+" data-scale-name="+this.name+">Delete</button> </div> ";
		$("#scaleUl").append(scaleLiM);
		//scale list in add scale modal
		var scaleOpA="<option id=scale"+this.scaleId+"Op value="+this.scaleId+">"+this.name+"</option>";
		$("#axesScale").append(scaleOpA);

		//add entity helper
     	addEntityhelper=new Helpers('addEEntityGotIt',"addEntityHelperModal","addEntityGotItBtn");

		
		
		
	},
	updateScale:function(data){
		var scaleTobeUpdated='scale'+this.scaleId;
		var axisToBeUpdated,axisId,rectData,circleData,textData;
		//update scale
		if(this.type==="Linear"){
			this.rangeFrom=data.rangeFrom;
			this.rangeTo=data.rangeTo;
		}
		else if(this.type==="Ordinal"){
			this.bandPadding=data.padding;
			this.width=data.width;
		}
		else{
			console.error("invalid scaleType");
		}
		this.setScales();

		//update all associate axis
	 	for(var key in project.scales[scaleTobeUpdated].axes){
 			axisId=project.scales[scaleTobeUpdated].axes[key].id;
 			axisToBeUpdated="axes"+axisId;
 			project.axes[axisToBeUpdated].updateAxesScale(this);
		}

		//update associated  rect
		
		for (var key in project.rect){
			
			if((project.rect[key].widthScaleId==this.scaleId)||(project.rect[key].heightScaleId==this.scaleId)||(project.rect[key].xPosScaleId==this.scaleId)||(project.rect[key].yPosScaleId==this.scaleId)){ // double == on purpose as RHS is num and LHS is string
				rectData={
					name:project.rect[key].name,
					width:project.rect[key].width,
					widthScale:project.rect[key].widthScaleId,
					height:project.rect[key].height,
					heightScale:project.rect[key].heightScaleId,
					xPos:project.rect[key].xPos,
					xPosScale:project.rect[key].xPosScaleId,
					yPos:project.rect[key].yPos,
					yPosScale:project.rect[key].yPosScaleId,
					xOffset:project.rect[key].offsetX,
					yOffset:project.rect[key].offsetY,
					color:project.rect[key].color,
					opacity:project.rect[key].opacity,
					pid:project.pid,
					dataset:project.rect[key].id_dataset
				};

				ajaxCall('post','rect/update/'+project.rect[key].id,rectData,'json',updateRectCallback);

			}

		
		}
		//update associated  circle
		
		for (var key in project.circle){
			
			if((project.circle[key].radiusScaleId==this.scaleId)||(project.circle[key].xPosScaleId==this.scaleId)||(project.circle[key].yPosScaleId==this.scaleId)){ // double == on purpose as RHS is num and LHS is string
				circleData={
					name:project.circle[key].name,
					radius:project.circle[key].radius,
					radiusScale:project.circle[key].radiusScaleId,
					xPos:project.circle[key].xPos,
					xPosScale:project.circle[key].xPosScaleId,
					yPos:project.circle[key].yPos,
					yPosScale:project.circle[key].yPosScaleId,
					color:project.circle[key].color,
					opacity:project.circle[key].opacity,
					pid:project.pid,
					dataset:project.circle[key].id_dataset
				};

				ajaxCall('post','circle/update/'+project.circle[key].id,circleData,'json',updateCircleCallback);
			}
		}
		//update associated text
		for (var key in project.text){
			
			if((project.text[key].textScaleId==this.scaleId)||(project.text[key].sizeScaleId==this.scaleId)){ // double == on purpose as RHS is num and LHS is string
				 textData={
				    name:project.text[key].name,
				    size:project.text[key].size,
				    sizeScale:project.text[key].sizeScaleId,
				    text:project.text[key].text,
				    textScale:project.text[key].textScaleId,
				    xPos:project.text[key].xPos,
				    xPosScale:project.text[key].xPosScaleId,
				    yPos:project.text[key].yPos,
				    yPosScale:project.text[key].yPosScaleId,
				    angle:project.text[key].angle,
				    color:project.text[key].color,
				    opacity:project.text[key].opacity,
				    pid:project.pid,
				    dataset:project.text[key].id_dataset
				  };

				ajaxCall('post','text/update/'+project.text[key].id,textData,'json',updateTextCallback);
			}
		}
		
	},

	deleteScale:function(){
	
		var scaleObject=this; //cache this as it is a lost in the call back funciton call
		var axisId,axisToBeDeleted;
		ajaxCall('post','scale/delete',this.scaleId,'text',scaleDelCallback);
		ajaxCall('post','projects/update/'+project.pid,'text',updateProjectCallback); //update project 

		function scaleDelCallback(data){
			var rectChanged,circleChanged;
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

			//update rectangle associted with to-be-deleted scale
			for (var key in project.rect){
				rectChanged=false;
				if(project.rect[key].widthScaleId==scaleObject.scaleId){ // double == on purpose as RHS is num and LHS is string
					project.rect[key].widthScaleId=null;
					project.rect[key].widthScaleName=null;
					rectChanged=true;
				}
				if(project.rect[key].heightScaleId==scaleObject.scaleId){
					project.rect[key].heightScaleId=null;
					project.rect[key].heightScaleName=null;
					rectChanged=true;
				}
				if(project.rect[key].xPosScaleId==scaleObject.scaleId){
					project.rect[key].xPosScaleId=null;
					project.rect[key].XScaleName=null;
					rectChanged=true;
				}
				if(project.rect[key].yPosScaleId==scaleObject.scaleId){
					project.rect[key].yPosScaleId=null;
					project.rect[key].YScaleName=null;
					rectChanged=true;
				}
				//update rect
				if(rectChanged){
					var rectData={
					name:project.rect[key].name,
					width:project.rect[key].width,
					widthScale:project.rect[key].widthScaleId,
					height:project.rect[key].height,
					heightScale:project.rect[key].heightScaleId,
					xPos:project.rect[key].xPos,
					xPosScale:project.rect[key].xPosScaleId,
					yPos:project.rect[key].yPos,
					yPosScale:project.rect[key].yPosScaleId,
					xOffset:project.rect[key].offsetX,
					yOffset:project.rect[key].offsetY,
					color:project.rect[key].color,
					opacity:project.rect[key].opacity,
					pid:project.pid,
					dataset:project.rect[key].id_dataset
					};

					ajaxCall('post','rect/update/'+project.rect[key].id,rectData,'json',updateRectCallback);
				}
			}

			//update circle associted with to-be-deleted scale
			for (var key in project.circle){
				circleChanged=false;
				if(project.circle[key].radiusScaleId==scaleObject.scaleId){ // double == on purpose as RHS is num and LHS is string
					project.circle[key].radiusScaleId=null;
					project.circle[key].radiusScaleName=null;
					circleChanged=true;
				}
				if(project.circle[key].xPosScaleId==scaleObject.scaleId){
					project.circle[key].xPosScaleId=null;
					project.circle[key].XScaleName=null;
					circleChanged=true;
				}
				if(project.circle[key].yPosScaleId==scaleObject.scaleId){
					project.circle[key].yPosScaleId=null;
					project.circle[key].YScaleName=null;
					circleChanged=true;
				}
				//update circle
				if(circleChanged){
					var circleData={
					name:project.circle[key].name,
					radius:project.circle[key].radius,
					radiusScale:project.circle[key].radiusScaleId,
					xPos:project.circle[key].xPos,
					xPosScale:project.circle[key].xPosScaleId,
					yPos:project.circle[key].yPos,
					yPosScale:project.circle[key].yPosScaleId,
					color:project.circle[key].color,
					opacity:project.circle[key].opacity,
					pid:project.pid,
					dataset:project.circle[key].id_dataset
					};

					ajaxCall('post','circle/update/'+project.circle[key].id,circleData,'json',updateCircleCallback);
				}
			}

		 	//delete scale object
		    delete project.scales[scaleTobeDeleted];

		    //delet
		}
	},

	setScales:function(){
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
			this.d3ScaleLateral=d3.scaleBand()
					.domain(this.domainOrdinal)
					.range([0,this.width])
					.padding(this.bandPadding);

			this.d3ScaleVertical=d3.scaleBand()
					.domain(this.domainOrdinal)
					.range([this.width,0])
					.padding(this.bandPadding);
		}
		else{
			console.error("Invalid scale type");
		}
	}
}