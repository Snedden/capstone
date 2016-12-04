function Circle(name,radius,xPos,yPos,color,opacity,id,id_dataset,radiusScale,xPosScale,yPosScale){
	var XScaleName="scale"+xPosScale;
	var YScaleName="scale"+yPosScale;
	var radiusScaleName="scale"+radiusScale;

	this.id=id;	
	this.type="Circle";
	this.name=name;
	this.radius=radius;
	this.xPos=xPos;
	this.yPos=yPos;
	this.color=color;
	this.opacity=opacity;
	this.originX=0;     //origin is in percent; (0 ,0) is deafault; (100,0) shift X 100 percent of width (50,50) center the origin and so on..
	this.originY=0;   //origin is in percent 
	this.id_dataset=id_dataset;
	this.radiusScaleId=radiusScale;
	this.xPosScaleId=xPosScale;
	this.yPosScaleId=yPosScale;
	this.datasetName='dataset'+id_dataset;

	if(xPosScale){
		XScaleName="scale"+xPosScale;
		this.xPosScale=project.scales[XScaleName];
		this.rawData=project.datasets[this.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,width or height
	}
	if(yPosScale){
		YScaleName="scale"+yPosScale;
		this.yPosScale=project.scales[YScaleName];
		this.rawData=project.datasets[this.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,width or height
	}
	if(radiusScale){
		radiusScaleName="scale"+radiusScale;
		this.radiusScale=project.scales[radiusScaleName];
		this.rawData=project.datasets[this.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,width or height
	}

	this.originXShift=this.radius*(this.originX/100);
	this.originYShift=this.radius*(this.originY/100);
	this.circleName="circle"+this.id;
	this.d3CircleId="d3Circle"+this.id;
	
	


	
}

Circle.prototype={
	addCircle:function(){
		//console.log("circle ",data);
		var groupLi;  //list item in group list
	
		//add to memory
		project.circle[this.circleName]=this;
		project.circleNum++;

		//add to screen
		groupLi="<div id=circle"+this.id+"><li id=Licircle"+this.id+"  class='groupItem circleGroupItem' data-entityid="+this.id+" data-entitytype=circle data-circleid="+this.id+" >"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary circleDelBtn'    data-circle-id="+this.id+" >Delete</button>  </div>";
		$("#groupsUl").append(groupLi);  		 	//add to list
		//////////add to stage 
		this.drawOnStage();

		


	},
	drawOnStage:function(){
		
		//add new group			
		project.stageEntities.append("g")                	
						.attr("class", "circle d3Entity")
	        			.attr("id",this.d3CircleId);		  
	    if(!this.isBasic()){
			//update attributes
			this.drawLinkedCircle();


		}
		else{
			//update attributes
			this.drawBasicCircle();		
		}
		
		
	},
	drawBasicCircle:function(){
		console.debug('Circle ',this);
		//update attributes
			d3.select("#"+this.d3CircleId)
				.append("circle") //add new circle
				.attr("r", this.radius)
				.attr("fill",this.color)
				.attr("fill-opacity",(0.01*this.opacity));
			//tranform to X and Y 	
			d3.select("#"+this.d3CircleId)
				.attr("transform", "translate("+(project.getStageX(this.xPos)-this.originXShift)+","+(project.getStageY(this.yPos)-this.originYShift)+")");
	},
	drawLinkedCircle:function(){
		var self=this;
		d3.select("#"+this.d3CircleId)
				.html("")  //remove previous circle
				.selectAll(".disc")
				.data(this.rawData)
    			.enter().append("circle") //add new circle
				 	.attr("r", function(d){
				 		if(self.radiusScale){
							return   self.radiusScale.d3ScaleLateral(d[self.radiusScale.dataCol.name])/12;   //reducing by  factor 10 to fit on screen
						}
				 		else{
				 			return self.radius;
				 		}
				 	})
				 	.attr("class", "disc")
					.attr("fill",this.color)
					.attr("fill-opacity",(0.01*this.opacity))
					.attr("cx", function(d) { 
						if(self.xPosScale){
							return (self.xPosScale.d3ScaleLateral.bandwidth()/2)+ self.xPosScale.d3ScaleLateral(d[self.xPosScale.dataCol.name]);  //adding the half of bandwith so center coincides with the scale band
						}
						else{
							return null;
						} })
					.attr("cy",function(d) { 
						if(self.yPosScale){
							return -(self.yPosScale.d3ScaleLateral(d[self.yPosScale.dataCol.name]));
						}
						else{
							return null;
						} });
		//tranform to X and Y 	

						d3.select("#"+this.d3CircleId)
				.attr("transform", " translate("+(project.getStageX(this.xPos)-this.originXShift)+","+(project.getStageY(this.yPos)-this.originYShift)+")");	 //scale(1,-)			

	},
	isBasic:function(){
		if(!this.radiusScale&&!this.xPosScale&&!this.yPosScale){
			return true;
		}		
	    else{
	    	return false;
	    }
	},
	updateCircle:function(){
		var groupLi;  //list item in group list

		//update to memory
		
		project.circle[this.circleName]=this;
		
		//update to screen
		$("#Li"+this.circleName).html(this.name); 		 	//update in list
		//////////add to stage 
		//remove previous circle
		d3.select("#"+this.d3CircleId)
				.remove();
		this.drawOnStage();
	},
	deleteCircle:function(id){
		var circleObject=this;
		console.log('delete ', circleObject);
		ajaxCall('post','circle/delete',this.id,'text',circleDelCallback);

		function circleDelCallback(data){
			var circleTobeDeleted='circle'+circleObject.id;
			var d3CircleTobeDeleted='d3Circle'+circleObject.id;
		    //delete form screen
		    $("#"+circleTobeDeleted).remove();    	//list entry item
		    $("#"+d3CircleTobeDeleted).remove();   	//rendered axis


		 	//delete from memory
		    delete project.circle[circleTobeDeleted];                              //delete axes object
		  	
		    
		}
	}

};

/////////////////////////////////event listeners
///////////////Clicks events

//add circle btn clicked
$("#addCircleBtn").click(function(){
	var circleData={
		name:'circle'+(project.circleNum+1),
		radius:150,
		xPos:500,
		yPos:200,
		color:'#D3D3D3',
		opacity:100,
		pid:project.pid
	};
	ajaxCall('post','circle/create',circleData,'json',addCircleCallback);

	function addCircleCallback(data){
		console.debug('opacity ',data.opacity);
		var circle=new Circle(data.name,data.radius,data.xPos,data.yPos,data.color,data.opacity,data.id);
		circle.addCircle();	
	}
});	

//open modal when double click
$(document).on('dblclick','.circleGroupItem',function(e){
	$('#addCircleModal').modal('show',$(this));
});
//delete circle
$(document).on('click','.circleDelBtn',function(e){

	var circleId=$(this).attr('data-circle-id');
	var circleTobeDeleted='circle'+circleId;
	project.circle[circleTobeDeleted].deleteCircle();

});

///////////////////modal events
//add circle modle open
$('#addCircleModal').on('show.bs.modal', function(e) {
	var circleId = $(e.relatedTarget).data('circleid');
	var circleName='circle'+circleId;
	var circleObj=project.circle[circleName];
	$("#circleId").val(circleId);           					//to be referenced in update clicked
	$('#circleDataset').attr('data-circleid',circleId);
	$(".circleLengths").attr("data-circleid",circleId);                //to be used in change dataset

	//console.log('circle', circleObj);

	//populate the textbox
    $(e.currentTarget).find('#circleName').val(circleObj.name);
    $(e.currentTarget).find('#circleRadius').val(circleObj.radius);
	$(e.currentTarget).find('#circleX').val(circleObj.xPos);
    $(e.currentTarget).find('#circleY').val(circleObj.yPos);
    $(e.currentTarget).find('#circleColor').val(circleObj.color);
    $(e.currentTarget).find('#circleOpacityInput').val(circleObj.opacity);
    $(e.currentTarget).find('#circleOpacityOutput').val(circleObj.opacity);
    $(e.currentTarget).find('#circleDataset').val(circleObj.id_dataset);


	$(e.currentTarget).find('#circleDataset').trigger("change"); 
    
   


});

///////////////submit events
//update circle
$("#circleForm").submit(function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	var circleId=$("#circleId").val();

	var circleData={
		name:$("#circleName").val(),
		radius:$("#circleRadius").val(),
		xPos:$("#circleX").val(),
		xPosScale:$("#circleXScale").val(),
		yPos:$("#circleY").val(),
		yPosScale:$("#circleYScale").val(),
		color:$("#circleColor").val(),
		opacity:$("#circleOpacityInput").val(),
		pid:project.pid,
		dataset:$("#circleDataset").val(),
		
		radiusScale:$("#circleRadiusScale").val(),
	};
	console.log('circleData ',circleData );
	ajaxCall('post','circle/update/'+circleId,circleData,'json',updateCircleCallback);
	$("#addCircleModal").modal('hide');//close modal dialog
	
});

function updateCircleCallback(data){
	console.log("circle ",data);
	var updatedCircle=new Circle(data.name,data.radius,data.xPos,data.yPos,data.color,data.opacity,data.id,data.dataset,data.radiusScale,data.xPosScale,data.yPosScale);
	
	updatedCircle.updateCircle();

}

//change events
//a data select is changed

//circleScale select is changed
$(document).on('change','.circleLengths',function(){
	var circleId = $(this).data('circleid');
	var circleName='circle'+circleId;
	var circleObj=project.circle[circleName];
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
		//$("#"+data.assinputid).html('');
		$(this).prop('required',true);	
	}
});

$(document).on('change', '#circleDataset', function() {
	var selectedDataset=$(this);
	var circleId = $(this).data('circleid');
	var circleName='circle'+circleId;
	var circleObj=project.circle[circleName];

	//console.log('circleDs',selectedDataset.val(), selectedDataset);

	//if no dataset selected toggle
	if(selectedDataset.val()===""){
		
		$(".circleSelect").hide();
	}
	else{
		ajaxCall('get','dataset/scales/'+selectedDataset.val(),'','json',getScalesCallback);
		$(".circleSelect").show();
	}

	function getScalesCallback(data){
		//remove previous
		$('.circleScaleSelect').html('');

		//add new
		for(var i=0;i<data.length;i++){
	        //add header once
	        if(i===0){
	          //Linear + ordinal scales
	          $('.circleScaleSelect').append($('<option>', { 
	                value:'',
	                text : 'No scale' 
	            }));
	          //only Linear scales
	          $('.circleLinearScaleSelect').append($('<option>', { 
	                value:'',
	                text : 'No scale' 
	          }));
	        }
	          //Linear + ordinal scales
	          $('.circleScaleSelect').append($('<option>', { 
	              value: data[i].idScales,
	              text : data[i].scale_name 
	          }));

	          //Linear  scales
	          if(data[i].type==="Linear"){ //only add Linear scales
	            $('.circleLinearScaleSelect').append($('<option>', { 
	              value: data[i].idScales,
	              text : data[i].scale_name 
	            }));
	          }


		}
		if(circleObj.radiusScaleId){
			$('#circleRadiusScale').val(circleObj.radiusScaleId);

		}
		else{
			$('#circleRadiusScale').val('');
		}
		if(circleObj.xPosScaleId){
			$('#circleXScale').val(circleObj.xPosScaleId);
		}
		else{
			$('#circleXScale').val('');
		}
	    if(circleObj.yPosScaleId){
	    	$('#circleYScale').val(circleObj.yPosScaleId);
	    }
	    else{
	    	$('#circleYScale').val('');
	    }

	    $('#circleRadiusScale').trigger("change");
	    
	   
	    
	}
});

