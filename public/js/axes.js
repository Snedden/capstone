function Axes(){

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
	console.log("scale callback ",data);
		if(data.type==="error"){
			$("#ajaxFeedback").html(data.message);

		}
}