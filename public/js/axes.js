function Axes(id,name,orient,xPos,yPos,scaleId,ticks,labelAngle,labelAnchor){
	this.id=id;
	this.type="Axes";
	this.name=name;
	this.orient=orient;
	this.xPos=xPos;
	this.yPos=yPos;
	this.scaleId=scaleId;
	this.ticks=ticks;
	this.d3AxisId="d3Axes"+this.id;
	this.labelAnchor=labelAnchor;
	this.labelAngle=labelAngle;


	console.log('ticks ',this.ticks);

	
	this.associatedScaleName="scale"+scaleId;
	this.associatedScale=project.scales[this.associatedScaleName];
	//assuming domain is the length of the associated scale
	if(this.associatedScale.type==="Linear"){
		this.length=this.associatedScale.rangeTo-this.associatedScale.rangeFrom;
	}
	else if(this.associatedScale.type==="Ordinal"){
		this.length=this.associatedScale.width;
	}
	else{
		console.error("Invalid scale type");
	}
	
	this.setAxes();


	
}


//Add axes/update axes
$("#axesForm").submit(function(e){
	var action=$("#addAxesBtn").html();

	e.preventDefault();
	e.stopImmediatePropagation();
	var axesData={
		name:$("#axesName").val(),
		scale:$("#axesScale").val(),
		orient:$("#axesOrient").val(),
		xPos:$("#axesX").val(),
		yPos:$("#axesY").val(),
		ticks:$("#axesTicks").val(),
		labelAngle:$("#axesLabelAngle").val(),
		labelAnchor:$("#axesLabelAnchor").val(),
		pid:project.pid
	};
	if(action==="Update"){
		axesData.id=$("#axesId").val();
		ajaxCall('post','axes/update',axesData,'json',axesUpdateCallback);
	}
	else if(action==="Add"){
		ajaxCall('post','axes/create',axesData,'json',axesAddCallback); 
	}
	else{
		console.error("invalid action for modify axes");
	}
	

	
	
});

function axesAddCallback(data){
	//console.log("axes callback ",data);
	if(data.type==="error"){
		$("#ajaxFeedback").html(data.message);

	}
	
	$("#ajaxFeedback").html(data.message);
	//add axes
	var axes=new Axes(data.id,data.name,data.orient,data.xPos,data.yPos,data.scaleId,data.ticks,data.labelAngle,data.labelAnchor); //create axes object
	axes.addAxes(); //add to screen and memory
	$("#addAxesModal").modal('hide');//close add axes modal
}

function axesUpdateCallback(data){
	//console.log("axes callback ",data);
	if(data.type==="error"){
		$("#ajaxFeedback").html(data.message);

	}
	
	$("#ajaxFeedback").html(data.message);
	//add axes
	var axes=new Axes(data.id,data.name,data.orient,data.xPos,data.yPos,data.scaleId,data.ticks,data.labelAngle,data.labelAnchor); //create axes object
	axes.updateAxes(); //add to screen and memory
	$("#addAxesModal").modal('hide');//close add axes modal
}

//delete axes
//del scale
$(document).on('click','.axesDelBtn',function(e){

	var axesId=$(this).attr('data-axes-id');
	var axesTobeDeleted='axes'+axesId;
	project.axes[axesTobeDeleted].deleteAxes();



});

//open modal when double click
$(document).on('dblclick','.axesGroupItem',function(e){
	console.debug('double cliked');
	$('#addAxesModal').modal('show',$(this));
});
//triggered when modal is about to be shown
$('#addAxesModal').on('show.bs.modal', function(e) {

	var axesId = $(e.relatedTarget).data('axes-id');
	console.debug('axesId', axesId);
	var axesName,axesObj;
    //clicked form entity group list
    if(axesId){
    	$("#axesId").val(axesId);
    	axesName='axes'+axesId;
    	axesObj=project.axes[axesName];
    	$("#axesName").val(axesObj.name);
    	$("#axesScale").val(axesObj.scaleId);
    	$("#axesOrient").val(axesObj.orient);
    	$("#axesX").val(axesObj.xPos);
    	$("#axesY").val(axesObj.yPos);
    	$("#axesTicks").val(axesObj.ticks);
    	$("#axesTextAnchor").val(axesObj.labelAnchor);
    	$("#axesLabelAngle").val(axesObj.labelAngle);

    	$("#addAxesBtn").html("Update");
    }
    else{
    	$("#addAxesBtn").html("Add");
    }
 });   

Axes.prototype={
	constructor:Axes,
	addAxes:function(){
		var self=this;
		var axesName="axes"+this.id;
		//add to memory
		project.axes[axesName]=this;
		project.scales[this.associatedScaleName].axes[axesName]={id:this.id};    //add axes to the associated scale    
		//add to screen
		var groupLi="<div id=axes"+this.id+"><li data-axes-id="+this.id+" data-entityid="+this.id+" data-entitytype=axes class='groupItem axesGroupItem'   id=Liaxes"+this.id+">"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary axesDelBtn'    data-axes-id="+this.id+" >Delete</button></div>  ";
		
	
		$("#groupsUl").append(groupLi);  		 	//add to list
		this.drawOnStage(); 


	},
	//called when scale is change to cascade the change into associated axes
	updateAxesScale:function(scale){
		//read updated scale values
		this.associatedScale=project.scales[this.associatedScaleName]; 
		//assuming domain is the length of the associated scale
		if(this.associatedScale.type==="Linear"){
			this.length=this.associatedScale.rangeTo-this.associatedScale.rangeFrom;
		}
		else if(this.associatedScale.type==="Ordinal"){
			this.length=this.associatedScale.width;
		}
		else{
			console.error("Invalid scale type");
		}
		this.setAxes();

		d3.select("#"+this.d3AxisId)				//remove previous from stage
				.remove();
		this.drawOnStage();                         //draw on stage 
	},
	deleteAxes:function(baseScaleDeleted){
		var axesObject=this; 						//cache this as it is a lost in the call back funciton call
		ajaxCall('post','axes/delete',this.id,'text',axesDelCallback);

		function axesDelCallback(data){
			var axesTobeDeleted='axes'+axesObject.id;
			var d3AxesTobeDeleted='d3Axes'+axesObject.id;
		    //delete form screen
		    $("#"+axesTobeDeleted).remove();    	//list entry item
		    $("#"+d3AxesTobeDeleted).remove();   	//rendered axis


		 	//delete from memory
		    delete project.axes[axesTobeDeleted];                              //delete axes object
		   	//if not deleting after deleting project.scales[axesObject.associatedScaleName] object
		    if(!baseScaleDeleted){
		    	delete project.scales[axesObject.associatedScaleName].axes[axesTobeDeleted]; //delete in the axes in associated scale
		    }
		    
		}
	},
	updateAxes:function(){
		var axesName="axes"+this.id;
		//update in  memory
		project.axes[axesName]=this;
		project.scales[this.associatedScaleName].axes[axesName]={id:this.id};    //add axes to the associated scale    
		//update to screen
		//remove previous axes
		d3.select("#"+this.d3AxisId)
				.remove();
		$("#Li"+axesName).html(this.name); 		 	//update in list
		this.drawOnStage(); 						//update in stage
	},
	drawOnStage:function(){
		var self=this;
		project.stageEntities.append("g")                	
        	.attr("class", "axis d3Entity")
        	.attr("id",this.d3AxisId)
            .attr("transform", "translate("+project.getAxisX(this.xPos,this.orient,this.associatedScale.rangeFrom)+" ,"+project.getAxisY(this.yPos,this.orient,this.associatedScale.rangeFrom,this.length)+")")
            .call(this.d3Axes)
            .selectAll("text")
			   	.attr("y", function(){
			   		if(self.orient==="Left" || self.orient==="Right"){  //align to ticks
			   			return -10;
			   		}
			   		else{
			   			return 0;
			   		}
			   	})
    			.attr("x", function(){
    				if(self.orient==="Bottom" ||self.orient==="Top"){ //align to ticks
    					return -1; 
    				}
    				else{
    					return 0;
    				}
    			})
			    .attr("dy", ".95em")
			    .attr("transform", "rotate("+-(self.labelAngle)+")")
			    .style("text-anchor", self.labelAnchor);; 

	},
	setAxes:function(){
		switch(this.orient){
			case "Left":
				this.d3Axes=d3.axisLeft(this.associatedScale.d3ScaleVertical)
					.ticks(this.ticks);
			break;
			case "Right":
				this.d3Axes=d3.axisRight(this.associatedScale.d3ScaleVertical)
					.ticks(this.ticks);
			break;
			case "Bottom":
				this.d3Axes=d3.axisBottom(this.associatedScale.d3ScaleLateral)
					.ticks(this.ticks);
			break;
			case "Top":
				this.d3Axes=d3.axisTop(this.associatedScale.d3ScaleLateral)
					.ticks(this.ticks);
			break
			default:
				console.error("Invalid axis orient");
		}
	}
}