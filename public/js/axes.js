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

Axes.prototype={
	constructor:Axes,
	addAxes:function(){
		var axesName="axes"+this.id;
		//add to memory
		project.axes[axesName]=this;
		//add to screen
		var groupLi="<li class='groupItem' id=groupItem_axes_+"+this.id+">"+this.name+"<button style='float:right;font-size:9px'  class='btn btn-xs btn-primary axesDelBtn'    data-axes-id="+this.id+" >Delete</button> </li> ";
		$("#groupsUl").append(groupLi);


	}
}