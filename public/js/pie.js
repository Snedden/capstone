function Pie(id,name,xPos,yPos,opacity,innerRadius,outerRadius,labelRadius,labelCol,valueCol,id_dataset,datasetName){
	this.id=id;
	this.name=name;
	this.xPos=xPos;
	this.yPos=yPos;
	this.opacity=opacity;
	this.originX=0;     //origin is in percent; (0 ,0) is deafault; (100,0) shift X 100 percent of width (50,50) center the origin and so on..
	this.originY=0;   //origin is in percent 
	this.innerRadius=innerRadius;
	this.outerRadius=outerRadius;
	this.labelRadius=labelRadius;
	this.labelCol=labelCol;
	this.valueCol=valueCol;
	this.pieName="pie"+this.id;
	this.id_dataset=id_dataset;
	this.printName=datasetName;

	this.datasetName='dataset'+id_dataset;
	this.labelColName='dataCol'+labelCol;
	this.valueColName='dataCol'+valueCol;

	this.ascDataset=project.datasets[this.datasetName];
	this.ascDataColValue=project.dataCols[this.valueColName];
	this.ascDataColLabel=project.dataCols[this.labelColName];


	this.originXShift=this.outerRadius*(this.originX/100);
	this.originYShift=this.outerRadius*(this.originY/100);
	this.pieName="pie"+this.id;
	this.d3PieId="d3Pie"+this.id;

	this.colorScale=d3.scaleOrdinal(d3.schemeCategory10);; //random for now
}

Pie.prototype={
	addPie: function(){
		//console.log("pie ",data);
		var groupLi;  //list item in group list
	
		

		//add to memory
		project.pie[this.pieName]=this;
		project.pieNum++;

		//add to screen
		groupLi="<div id=pie"+this.id+"><li id=Lipie"+this.id+"  class='groupItem pieGroupItem'data-pie-id="+this.id+" data-entityid="+this.id+" data-entitytype=pie data-pieid="+this.id+" >"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary pieDelBtn'    data-pie-id="+this.id+" >Delete</button>  </div>";
		$("#groupsUl").append(groupLi);  		 	//add to list
		//////////add to stage 
		this.drawOnStage();

		
	},
	updatePie:function(){
		var groupLi;  //list item in group list

		//update to memory
		
		project.pie[this.pieName]=this;
		
		//update to screen
		$("#Li"+this.pieName).html(this.name); 		 	//update in list
		//////////add to stage 
		//remove previous pie
		d3.select("#"+this.d3PieId)
				.remove();
		this.drawOnStage();
	},
		deletePie:function(id){
		var pieObject=this;
		console.log('delete ', pieObject);
		ajaxCall('post','pie/delete',this.id,'text',pieDelCallback);

		function pieDelCallback(data){
			var pieTobeDeleted='pie'+pieObject.id;
			var d3PieTobeDeleted='d3Pie'+pieObject.id;
		    //delete form screen
		    $("#"+pieTobeDeleted).remove();    	//list entry item
		    $("#"+d3PieTobeDeleted).remove();   //rendered pie


		 	//delete from memory
		    delete project.pie[pieTobeDeleted];                              //delete pie object
		  	
		    
		}
	},
	drawOnStage:function(){
		console.log('pie this ',this);
		var self=this;
		//add new group			
		project.stageEntities.append("g")                	
						.attr("class", "pie d3Entity")
	        			.attr("id",this.d3PieId);

	    var labelArc = d3.arc()              //have all the labels on the centroid of this arc which is circlular disc of width 0 really
		    .outerRadius(self.labelRadius)
		    .innerRadius(self.labelRadius);    			

		var arcs = d3.pie()
            .sort(null)
            .value(function(d) { return d[self.ascDataColValue.name]; })   //pie.ascdataCol.name is pie.ascDataset.rawData{columnName}
            (this.ascDataset.rawData);

		var arc = d3.arc()
            .outerRadius(this.outerRadius)
            .innerRadius(this.innerRadius)
            .padAngle(0.005)
            .cornerRadius(1) ;

        var pieG =d3.select("#"+this.d3PieId)
        	.selectAll("g")
            .data([this.ascDataset.rawData])
            .enter()
            .append("g")
            

        var block = pieG.selectAll(".arc")
            .data(arcs);
            
        var newBlock = block.enter().append("g").classed("arc", true); 

        newBlock.append("path")
            .attr("d", arc)
            .attr("id", function(d, i) { return "arc-" + i })
            .attr("stroke", "gray")
            .attr("fill", function(d,i){ return self.colorScale(i) }) 
            .attr("fill-opacity",(0.01*this.opacity));

  /*      newBlock.append("text")
            .attr("dx", 55)
            .attr("dy", -5)
            .append("textPath")
            .attr("xlink:href", function(d, i) { return "#arc-" + i; })
            .text(function(d) { console.log(d);return d.data[self.ascDataColLabel.name] }) */

        newBlock.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = self.labelRadius;
                return "translate(" + labelArc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return d.data[self.ascDataColLabel.name]; });        //get the label from our original data array   

        			//tranform to X and Y 	
			d3.select("#"+this.d3PieId)
				.attr("transform", "translate("+(project.getStageX(this.xPos)-this.originXShift)+","+(project.getStageY(this.yPos)-this.originYShift)+")");                  
	}
}
//Click events
//open modal when double click
$(document).on('dblclick','.pieGroupItem',function(e){
	console.debug('double cliked');
	$('#addPieModal').modal('show',$(this));
});

//delete pie
$(document).on('click','.pieDelBtn',function(e){

	var pieId=$(this).attr('data-pie-id');
	var pieTobeDeleted='pie'+pieId;
	project.pie[pieTobeDeleted].deletePie();

});

///////////////////modal events
//add pie modle open
$('#addPieModal').on('show.bs.modal', function(e) {

	//a data select is changed
	var pieName,pieObj,pieId;
	$(document).on('change', '#pieDataset', function() {
		var selectedDataset=$(this);


		//if no dataset selected toggle
		if(selectedDataset.val()===""){
			
			$(".selectPieDiv").hide();
		}
		else{
			ajaxCall('get','dataset/columns/'+selectedDataset.val(),'','json',getColsCallback);
			$(".selectPieDiv").show();
		}

		function getColsCallback(data){

					//remove previous
			$('#pieValues').html('');
			$('#pieLabels').html('');
			$('.pieSelects').append($('<option>', { 
		        value:'',
		        text : 'No Column' 
			}));


			//add new
			for(var i=0;i<data.length;i++){
	
				if(data[i].col_type==="Number"){
				   $('#pieValues').append($('<option>', { 
				        value: data[i].col_Id,
				        text : data[i].col_name 
			    	}));		
				}
			   $('#pieLabels').append($('<option>', { 
				        value: data[i].col_Id,
				        text : data[i].col_name 
			    	}));

			 

			}
			if(pieObj){ //its an update
				$('#pieLabels').val(pieObj.labelCol);
		   		$('#pieValues').val(pieObj.valueCol);
			}
		   	

		    
		}
	});


	pieId = $(e.relatedTarget).data('pie-id');
	console.debug('pieId', pieId);
	
    //clicked form entity group list
    if(pieId){
    	$("#pieId").val(pieId);
    	pieName='pie'+pieId;
    	pieObj=project.pie[pieName];

    	$("#pieName").val(pieObj.name);

		$("#pieX").val(pieObj.xPos);
    	$("#pieY").val(pieObj.yPos);

    	$('#pieOpacityInput').val(pieObj.opacity);
    	$('#pieOpacityOutput').val(pieObj.opacity);

    	$('#pieDataset').val(pieObj.id_dataset);

    	$('#pieInnerRadius').val(pieObj.innerRadius);
    	$('#pieOuterRadius').val(pieObj.outerRadius);
    	$('#pieLabelRadius').val(pieObj.labelRadius);
    	
 
    	$('#pieLabels').val(pieObj.labelCol);
    	$('#pieValues').val(pieObj.valueCol);

    	$("#updatePieBtn").html("Update");
    }
    else{
    	$("#updatePieBtn").html("Add");
    }
    $('#pieDataset').trigger("change");
});

///////////////submit events
//update pie
$("#pieForm").submit(function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	var pieId=$("#pieId").val();
	var dataset=($("#pieDataset option:selected").text());
	var datasetName=dataset.split(".");
	datasetName=datasetName[0];
	var action=$("#updatePieBtn").text();

	var pieData={
		name:$("#pieName").val(),
	 	innerRadius:$("#pieInnerRadius").val(),
	 	outerRadius:$("#pieOuterRadius").val(),
	 	labelRadius:$("#pieLabelRadius").val(),
		xPos:$("#pieX").val(),
		yPos:$("#pieY").val(),
		valueCol:$("#pieValues").val(),
		labelCol:$("#pieLabels").val(),
		opacity:$("#pieOpacityInput").val(),
		pid:project.pid,
		dataset:$("#pieDataset").val(),
		datasetName: datasetName
	};
	console.log(pieData);

	if(action==="Add"){
		ajaxCall('post','pie/create/',pieData,'json',addPieCallback);
	}
	else if(action==="Update"){
		ajaxCall('post','pie/update/'+pieId,pieData,'json',updatePieCallback);
	}
	else{
		console.error("Invalid action");
	}
	
	

	$("#addPieModal").modal('hide');//close modal dialog
	
});

function addPieCallback(data){
	var pie=new Pie(data.id,data.name,data.xPos,data.yPos,data.opacity,data.innerRadius,data.outerRadius,data.labelRadius,data.labelCol,data.valueCol,data.dataset,data.datasetName);
	pie.addPie();
}

function updatePieCallback(data){
	var updatedPie=new Pie(data.id,data.name,data.xPos,data.yPos,data.opacity,data.innerRadius,data.outerRadius,data.labelRadius,data.labelCol,data.valueCol,data.dataset,data.datasetName);
	updatedPie.updatePie();
}