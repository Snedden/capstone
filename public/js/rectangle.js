function Rectangle(name,width,height,xPos,yPos,color,opacity,id){
	
	this.id=id;	
	this.name=name;
	this.width=width;
	this.height=height;
	this.xPos=xPos;
	this.yPos=yPos;
	this.color=color;
	this.opacity=opacity;
	this.originX=0;     //origin is in percent; (0 ,0) is deafault; (100,0) shift X 100 percent of width (50,50) center the origin and so on..
	this.originY=100;   //origin is in percent 

	
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

		//add to screen
		groupLi="<li class='groupItem' id=rect"+this.id+">"+this.name+"<button style='float:right;font-size:9px'  class='btn btn-xs btn-primary rectDelBtn'    data-rect-id="+this.id+" >Delete</button> </li> ";
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
		name:'rectangle',
		width:150,
		height:100,
		xPos:500,
		yPos:200,
		xOffset:0,
		yOffset:0,
		color:'#D3D3D3',
		opacity:0.9,
		pid:project.pid
	};
	ajaxCall('post','rect/create',rectData,'json',addRectCallback);

	function addRectCallback(data){
		var rect=new Rectangle(data.name,data.width,data.height,data.xPos,data.yPos,data.color,data.opacity,data.id);
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
	var rectData={
		name:$("#rectName").val(),
		width:$("#rectWidth").val(),
		widthAxes:$("#rectWidthAxis").val(),
		height:$("#rectHeight").val(),
		heightAxes:$("#rectHeightAxis").val(),
		xPos:$("#rectX").val(),
		xPosAxes:$("#rectXAxis").val(),
		yPos:$("#rectY").val(),
		yPosAxes:$("#rectYAxis").val(),
		xOffset:$("#rectXOffset").val(),
		yOffset:$("#rectYOffset").val(),
		color:$("#rectColor").val(),
		opacity:$("#rectOpacityOutput").val(),
		pid:project.pid
	};

	ajaxCall('post','rect/create',rectData,'json',updateRectCallback);
	//console.debug("rectData ", rectData);
});

function updateRectCallback(data){
	console.log("rect ",data);


}
///////////////////modal events
//add rect modle open
$('#addRectModal').on('show.bs.modal', function(e) {
	console.log('rect');
});
/////////////////change events
//rectAxis select is changed
$(document).on('change','.rectAxisSelect',function(){
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
		//$("#"+data.assinputid).val();
		$("#"+data.assinputid).prop("disabled",true);
		$("#"+data.assinputid).prop('required',false);
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
			        value:'',
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