function Rectangle(name,width,height,xPos,yPos,color,opacity,id,offsetX,offsetY,id_dataset,widthScale,heightScale,xPosScale,yPosScale){
	var XScaleName="scale"+xPosScale;
	var YScaleName="scale"+yPosScale;
	var widthScaleName="scale"+widthScale;
	var heightScaleName="scale"+heightScale;

	
	
	
	this.id=id;	
	this.type="Rectangle";
	this.name=name;
	this.width=width;
	this.height=height;
	this.xPos=xPos;
	this.offsetX=offsetX;
	this.yPos=yPos;
	this.offsetY=offsetY
	this.color=color;
	this.opacity=opacity;
	this.originX=0;     //origin is in percent; (0 ,0) is deafault; (100,0) shift X 100 percent of width (50,50) center the origin and so on..
	this.originY=0;   //origin is in percent 
	this.id_dataset=id_dataset;
	this.widthScaleId=widthScale;
	this.heightScaleId=heightScale;
	this.xPosScaleId=xPosScale;
	this.yPosScaleId=yPosScale;

	if(xPosScale){
		XScaleName="scale"+xPosScale;
		this.xPosScale=project.scales[XScaleName];
		this.rawData=project.datasets[this.xPosScale.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,width or height
	}
	if(yPosScale){
		YScaleName="scale"+yPosScale;
		this.yPosScale=project.scales[YScaleName];
		this.rawData=project.datasets[this.yPosScale.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,width or height
	}
	if(widthScale){
		widthScaleName="scale"+widthScale;
		this.widthScale=project.scales[widthScaleName];
		this.rawData=project.datasets[this.widthScale.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,width or height
	}
	if(heightScale){
		heightScaleName="scale"+heightScale;
		this.heightScale=project.scales[heightScaleName];
		this.rawData=project.datasets[this.heightScale.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,width or height
	}

	this.originXShift=this.width*(this.originX/100);
	this.originYShift=this.height*(this.originY/100);
	this.rectName="rect"+this.id;
	this.d3RectId="d3Rect"+this.id;
	
	


	
}


Rectangle.prototype={
	addRect:function(){
		//console.log("rect ",data);
		var groupLi;  //list item in group list
	
		

		//add to memory
		project.rect[this.rectName]=this;
		project.rectNum++;

		//add to screen
		groupLi="<div id=rect"+this.id+"><li  class='groupItem rectGroupItem' data-entityid="+this.id+" data-entitytype=rect data-rectid="+this.id+" >"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary rectDelBtn'    data-rect-id="+this.id+" >Delete</button>  </div>";
		$("#groupsUl").append(groupLi);  		 	//add to list
		//////////add to stage 
		this.drawOnStage();

		


	},
	deleteRect:function(id){
		var rectObject=this;
		console.log('delete ', rectObject);
		ajaxCall('post','rect/delete',this.id,'text',rectDelCallback);

		function rectDelCallback(data){
			var rectTobeDeleted='rect'+rectObject.id;
			var d3RectTobeDeleted='d3Rect'+rectObject.id;
		    //delete form screen
		    $("#"+rectTobeDeleted).remove();    	//list entry item
		    $("#"+d3RectTobeDeleted).remove();   	//rendered axis


		 	//delete from memory
		    delete project.rect[rectTobeDeleted];                              //delete axes object
		  	
		    
		}
	},
	updateRect:function(){
		//console.log("rect ",data);
		var groupLi;  //list item in group list

		//update to memory
		
		project.rect[this.rectName]=this;
		
		//update to screen
		groupLi="<div id=rect"+this.id+"><li data-entityid="+this.id+" data-entitytype=rect  class='groupItem rectGroupItem' data-rectid="+this.id+" >"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary rectDelBtn'    data-rect-id="+this.id+" >Delete</button></div> ";
		$("#rect"+this.id).html(groupLi);  		 	//update  list item
		//////////add to stage 
		//remove previous rect
		d3.select("#"+this.d3RectId)
				.remove();
		this.drawOnStage();
		
						
	},
	drawOnStage:function(){
		
		//add new group			
		project.stageEntities.append("g")                	
						.attr("class", "rect d3Entity")
	        			.attr("id",this.d3RectId);		  
		if(!this.isBasic()){
			//update attributes
			this.drawLinkedRect();


		}
		else{
			//update attributes
			this.drawBasicRect();	
		}
	},
	isBasic:function(){
		if(!this.widthScale&&!this.heightScale&&!this.xPosScale&&!this.yPosScale){
			return true;
		}		
	    else{
	    	return false;
	    }
	},
	drawBasicRect:function(){
		//update attributes
			d3.select("#"+this.d3RectId)
				.append("rect") //add new rect
				.attr("width", this.width)
				.attr("height", this.height)
				.attr("fill",this.color)
				.attr("fill-opacity",(0.01*this.opacity));
			//tranform to X and Y 	
			d3.select("#"+this.d3RectId)
				.attr("transform", "scale(1,-1) translate("+(project.getStageX(this.xPos)-this.originXShift)+","+-(project.getStageY(this.yPos)-this.originYShift)+")");
	},
	drawLinkedRect:function(){
		var self=this;
		d3.select("#"+this.d3RectId)
				.html("")  //remove previous rect
				.selectAll(".bar")
				.data(this.rawData)
    			.enter().append("rect") //add new rect
				 	.attr("width", function(d){
				 		if(self.widthScale){
							return   self.widthScale.d3ScaleLateral(d[self.widthScale.colName]);   
						}
				 		if(self.xPosScale){
				 			return self.xPosScale.d3ScaleLateral.bandwidth();
				 			
				 		}
				 		else{
				 			return self.width;
				 		}
				 	})
				 	.attr("class", "bar")
					.attr("height", function(d,i){
						if(self.heightScale){
							return   self.heightScale.d3ScaleLateral(d[self.heightScale.colName]) ;   //since the bot is excluded from height,think about it can't explain
						}
				 		if(self.yPosScale){
				 			return self.yPosScale.d3ScaleVertical.bandwidth();
				 		}
				 		else{
				 			return self.height;
				 		}
				 	})
					.attr("fill",this.color)
					.attr("fill-opacity",(0.01*this.opacity))
					.attr("x", function(d) { 
						if(self.xPosScale){
							return self.xPosScale.d3ScaleLateral(d[self.xPosScale.colName]);
						}
						else{
							return null;
						} })
					.attr("y",function(d) { 
						if(self.yPosScale){
							return (self.yPosScale.d3ScaleLateral(d[self.yPosScale.colName]));
						}
						else{
							return null;
						} });
		//tranform to X and Y 	
/*			d3.select("#"+this.d3RectId)
				.attr("transform", "translate("+(project.getStageX(this.xPos)-this.originXShift)+","+(project.getStageY(this.yPos)-this.originYShift)+")");*/
						d3.select("#"+this.d3RectId)
				.attr("transform", "scale(1,-1) translate("+(project.getStageX(this.xPos)-this.originXShift)+","+-(project.getStageY(this.yPos)-this.originYShift)+")");	 //scale(1,-)			

	}



}






function setOutputOpacity(rangeInput){
	var rangeInputEle=$(rangeInput);
	var rangeOutputEle=$("#scaleBandPaddingOrdinalOutput");
	var outputRange=((parseInt(rangeInputEle.val())*0.01)).toFixed(2);
	rangeOutputEle.val(outputRange);
}

/////////////////////////////////event listeners
///////////////Clicks events

//add rect btn clicked
$("#addRectBtn").click(function(){
	var rectData={
		name:'rectangle'+(project.rectNum+1),
		width:150,
		height:100,
		xPos:500,
		yPos:200,
		xOffset:0,
		yOffset:0,
		color:'#D3D3D3',
		opacity:100,
		pid:project.pid
	};
	ajaxCall('post','rect/create',rectData,'json',addRectCallback);

	function addRectCallback(data){
		console.debug('opacity ',data.opacity);
		var rect=new Rectangle(data.name,data.width,data.height,data.xPos,data.yPos,data.color,data.opacity,data.id,data.offsetX,data.offsetY);
		rect.addRect();	
	}
});

//open modal when double click
$(document).on('dblclick','.rectGroupItem',function(e){
	console.debug('double cliked');
	$('#addRectModal').modal('show',$(this));
});

//delete rect
$(document).on('click','.rectDelBtn',function(e){

	var rectId=$(this).attr('data-rect-id');
	var rectTobeDeleted='rect'+rectId;
	project.rect[rectTobeDeleted].deleteRect();



});

///////////////submit events
//update rect
$("#rectForm").submit(function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	var rectId=$("#rectId").val();

	var rectData={
		name:$("#rectName").val(),
		width:$("#rectWidth").val(),
		widthScale:$("#rectWidthScale").val(),
		height:$("#rectHeight").val(),
		heightScale:$("#rectHeightScale").val(),
		xPos:$("#rectX").val(),
		xPosScale:$("#rectXScale").val(),
		yPos:$("#rectY").val(),
		yPosScale:$("#rectYScale").val(),
		xOffset:$("#rectXOffset").val(),
		yOffset:$("#rectYOffset").val(),
		color:$("#rectColor").val(),
		opacity:$("#rectOpacityInput").val(),
		pid:project.pid,
		dataset:$("#rectDataset").val()
	};

	ajaxCall('post','rect/update/'+rectId,rectData,'json',updateRectCallback);
	$("#addRectModal").modal('hide');//close modal dialog
	
});

function updateRectCallback(data){
	console.log("rect ",data);
	var updatedRect=new Rectangle(data.name,data.width,data.height,data.xPos,data.yPos,data.color,data.opacity,data.id,data.xOffset,data.yOffset,data.dataset,data.widthScale,data.heightScale,data.xPosScale,data.yPosScale);
	
	updatedRect.updateRect();

}
///////////////////modal events
//add rect modle open
$('#addRectModal').on('show.bs.modal', function(e) {
	var rectId = $(e.relatedTarget).data('rectid');
	var rectName='rect'+rectId;
	var rectObj=project.rect[rectName];
	$("#rectId").val(rectId);           					//to be referenced in update clicked

	console.log('rect', rectObj);

	//populate the textbox
    $(e.currentTarget).find('#rectName').val(rectObj.name);
    $(e.currentTarget).find('#rectHeight').val(rectObj.height);
    $(e.currentTarget).find('#rectWidth').val(rectObj.width);
    $(e.currentTarget).find('#rectX').val(rectObj.xPos);
    $(e.currentTarget).find('#rectY').val(rectObj.yPos);
    $(e.currentTarget).find('#rectColor').val(rectObj.color);
    $(e.currentTarget).find('#rectOpacityInput').val(rectObj.opacity);
    $(e.currentTarget).find('#rectOpacityOutput').val(rectObj.opacity);
    $(e.currentTarget).find('#rectDataset').val(rectObj.id_dataset);
    
   

    //a data select is changed
	$(document).on('change', '#rectDataset', function() {
		var selectedDataset=$(this);

		//console.log('rectDs',selectedDataset.val(), selectedDataset);

		//if no dataset selected toggle
		if(selectedDataset.val()===""){
			
			$(".rectSelect").hide();
		}
		else{
			ajaxCall('get','dataset/scales/'+selectedDataset.val(),'','json',getScalesCallback);
			$(".rectSelect").show();
		}

		function getScalesCallback(data){
			//remove previous
			$('.rectScaleSelect').html('');

			//add new
			for(var i=0;i<data.length;i++){
				//add header once
				if(i===0){
					$('.rectScaleSelect').append($('<option>', { 
				        value:'',
				        text : 'No scale' 
				    }));
				}
			    $('.rectScaleSelect').append($('<option>', { 
			        value: data[i].idScales,
			        text : data[i].scale_name 
			    }));

			}
			$(e.currentTarget).find('#rectWidthScale').val(rectObj.widthScaleId);
		    $(e.currentTarget).find('#rectHeightScale').val(rectObj.heightScaleId);
		    $(e.currentTarget).find('#rectXScale').val(rectObj.xPosScaleId);
		    $(e.currentTarget).find('#rectYScale').val(rectObj.yPosScaleId);
		   
		    
		}
	});
	$(e.currentTarget).find('#rectDataset').trigger("change"); 
});
/////////////////change events
//rectScale select is changed
$(document).on('change','.rectLengths',function(){
	var data=$(this).data();

	console.log('val ',$(this).val());
	if($(this).val()===""){
		//$("#"+data.assinputid).val("");
		console.log('disabled');
		$("#"+data.assinputid).prop("disabled",false);
		$("#"+data.assinputid).prop('required',true);

		$(this).prop('required',false);
	}
	else{
		//$("#"+data.assinputid).val('');
		$("#"+data.assinputid).prop("disabled",true);
		$("#"+data.assinputid).prop('required',false);
		$("#"+data.assinputid).html('');
		$(this).prop('required',true);	
	}
});

