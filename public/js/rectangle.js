function Rectangle(name,width,height,xPos,yPos,color,opacity,id,offsetX,offsetY,id_dataset){
	
	this.id=id;	
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
	this.originY=100;   //origin is in percent 
	this.axes={}		//related axes
	this.id_dataset=id_dataset;
	
}


Rectangle.prototype={
	addRect:function(){
		//console.log("rect ",data);
		var groupLi;  //list item in group list
		var originXShift=this.width*(this.originX/100);
		var originYShift=this.height*(this.originY/100);
		var d3RectId="d3Rect"+this.id;
		var rectName="rect"+this.id;
		

		//add to memory
		project.rect[rectName]=this;
		project.rectNum++;

		//add to screen
		groupLi="<div id=rect"+this.id+"><li data-toggle='modal' data-target='#addRectModal' class='groupItem' data-rectid="+this.id+" >"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary rectDelBtn'    data-rect-id="+this.id+" >Delete</button>  </div>";
		$("#groupsUl").append(groupLi);  		 	//add to list
		//////////add to stage 
		project.stage.append("g")                	
						.attr("class", "rect")
	        			.attr("id",d3RectId)
						.append("rect")
						.attr("x", (project.getStageX(0)-originXShift))         ///////////////add to origin first
						.attr("y", (project.getStageY(0)-originYShift))
						.attr("width", this.width)
						.attr("height", this.height)
						.attr("fill",this.color)
						.attr("fill-opacity",this.opacity);
		//tranform to x and y
		d3.select("#"+d3RectId)
			.attr("transform", "translate("+this.xPos+",-"+this.yPos+")");	
		


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
		var originXShift=this.width*(this.originX/100);
		var originYShift=this.height*(this.originY/100);
		var d3RectId="d3Rect"+this.id;
		var rectName="rect"+this.id;
		

		//update to memory
		project.rect[rectName]=this;
		
		//update to screen
		groupLi="<li data-toggle='modal' data-target='#addRectModal' class='groupItem' data-rectid="+this.id+" >"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary rectDelBtn'    data-rect-id="+this.id+" >Delete</button> ";
		$("#rect"+this.id).html(groupLi);  		 	//update  list item
		//////////add to stage 

		//temporary ,need to change later
		if(this.id_dataset){
			//don't do anything
		}
		else{
			//update attributes
			d3.select("#"+d3RectId)
				.html("")  //remove previous rect
				 	.append("rect") //add new rect
					.attr("width", this.width)
					.attr("height", this.height)
					.attr("fill",this.color)
					.attr("fill-opacity",this.opacity);
			//tranform to ORIGIN 	first
			d3.select("#"+d3RectId)
				.attr("transform", "translate("+(project.getStageX(this.xPos)-originXShift)+","+(project.getStageY(this.yPos)-originYShift)+")");

		}
		
						
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
	//console.log("rect ",data);
	var updatedRect=new Rectangle(data.name,data.width,data.height,data.xPos,data.yPos,data.color,data.opacity,data.id,data.offsetX,data.offsetY,data.dataset);
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
});
/////////////////change events
//rectScale select is changed
$(document).on('change','.rectScaleSelect',function(){
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
	}
}); 