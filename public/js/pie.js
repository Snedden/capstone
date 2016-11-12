function Pie(id,name,xPos,yPos,opacity,innerRadius,outerRadius,labelRadius,labelCol,valueCol,id_dataset,datasetName){
	this.id=id;
	this.name=name;
	this.xPos=xPos;
	this.yPos=yPos;
	this.opacity=opacity;
	this.innerRadius=innerRadius;
	this.outerRadius=outerRadius;
	this.labelRadius=labelRadius;
	this.labelCol=labelCol;
	this.valueCol=valueCol;
	this.pieName="pie"+this.id;
	this.id_dataset=id_dataset;
	this.datasetName=datasetName;

	this.assDataset=project.datasets[datasetName];


}

Pie.prototype={
	addPie: function(){
		//console.log("pie ",data);
		var groupLi;  //list item in group list
	
		

		//add to memory
		project.pie[this.pieName]=this;
		project.pieNum++;

		//add to screen
		groupLi="<div id=pie"+this.id+"><li id=Lipie"+this.id+"  class='groupItem pieGroupItem' data-entityid="+this.id+" data-entitytype=pie data-pieid="+this.id+" >"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary pieDelBtn'    data-pie-id="+this.id+" >Delete</button>  </div>";
		$("#groupsUl").append(groupLi);  		 	//add to list
		//////////add to stage 
		this.drawOnStage();

		
	},
	drawOnStage:function(){
		console.log('pie this ',this);
		var color = d3.scale.ordinal()
    		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		var arc = d3.svg.arc()
		    .outerRadius(this.outerRadius)
		    .innerRadius(this.innerRadius);
	}
}

///////////////////modal events
//add pie modle open
$('#addPieModal').on('show.bs.modal', function(e) {

	//a data select is changed
	$(document).on('change', '#pieDataset', function() {
		var selectedDataset=$(this);


		//if no dataset selected toggle
		if(selectedDataset.val()===""){
			
			$(".selectPieDiv").hide();
		}
		else{
			ajaxCall('get','dataset/columns/'+selectedDataset.val(),'','json',getScalesCallback);
			$(".selectPieDiv").show();
		}

		function getScalesCallback(data){

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

		   
		    
		}
	});
	$(e.currentTarget).find('#pieDataset').trigger("change"); 
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
	ajaxCall('post','pie/create/',pieData,'json',addPieCallback);
	//ajaxCall('post','pie/update/'+pieId,pieData,'json',updateRectCallback);

	$("#addPieModal").modal('hide');//close modal dialog
	
});

function addPieCallback(data){
	var pie=new Pie(data.id,data.name,data.xPos,data.yPos,data.opacity,data.innerRadius,data.outerRadius,data.labelRadius,data.labelCol,data.valueCol,data.dataset,data.datasetName);
	pie.addPie();
}