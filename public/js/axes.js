function Axes(id,name,orient,xPos,yPos,scaleId,ticks){
	this.id=id;
	this.name=name;
	this.orient=orient;
	this.xPos=xPos;
	this.yPos=yPos;
	this.scaleId=scaleId;
	this.ticks=ticks;
}


//Add axes
$("#axesForm").submit(function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	var axesData={
		name:$("#axesName").val(),
		scale:$("#axesScale").val(),
		orient:$("#axesOrient").val(),
		xPos:$("#axesX").val(),
		yPos:$("#axesY").val(),
		ticks:$("#axesTicks").val(),
		pid:project.pid
	};

	ajaxCall('post','axes/create',axesData,'json',axesAddCallback); 
	
});

function axesAddCallback(data){
	console.log("axes callback ",data);
		if(data.type==="error"){
			$("#ajaxFeedback").html(data.message);

		}
	
	$("#ajaxFeedback").html(data.message);
	//add axes
	var axes=new Axes(data.id,data.name,data.orient,data.xPos,data.yPos,data.scaleId,data.ticks); //create axes object
	axes.addAxes(); //add to screen and memory
	$("#addAxesModal").modal('hide');//close add axes modal
}
//add axes end

//delete axes
//del scale
$(document).on('click','.axesDelBtn',function(e){

	var axesId=$(this).attr('data-axes-id');
	var axesTobeDeleted='axes'+axesId;
	project.axes[axesTobeDeleted].deleteAxes();



});

Axes.prototype={
	constructor:Axes,
	addAxes:function(){
		var axesName="axes"+this.id;
		//add to memory
		project.axes[axesName]=this;
		//add to screen
		var groupLi="<li class='groupItem' id=axes"+this.id+">"+this.name+"<button style='float:right;font-size:9px'  class='btn btn-xs btn-primary axesDelBtn'    data-axes-id="+this.id+" >Delete</button> </li> ";
		$("#groupsUl").append(groupLi);


	},
	deleteAxes:function(){
		var axesObject=this; //cache this as it is a lost in the call back funciton call
		ajaxCall('post','axes/delete',this.id,'text',axesDelCallback);

		function axesDelCallback(data){
			var axesTobeDeleted='axes'+axesObject.id;
		    //delete form screen
		    $("#"+axesTobeDeleted).remove();
		 	//delete from memory
		    delete project.axes[axesTobeDeleted];
		}
	}
}