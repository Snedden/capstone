function Project(pid,puid,pname,pdataSets,pScales,pAxes,pRects,pCircles,pPies,pTexts){
	this.stageMarginLeft=30;
	this.stageMarginBot=30;
	this.stageWidth=$("#stageDiv").width();
	this.stageHeight=$("#stageDiv").height();
	this.stageBorder=1; //stage border 1 pixel
	var self=this;

	this.pid=pid;
	this.pname=pname;
	this.puid=puid;
	this.dataSetLoaded=0;
	this.NumberOfDataSets=0;
	this.serverFetchedDatasets=pdataSets;
	this.datasets=[];
	this.dataCols=[];
	this.scales={};
	this.axes={};
	this.rect={};
	this.circle={};
	this.pie={};
	this.text={};
	this.rectNum=0;
	this.circleNum=0;
	this.textNum=0;
	this.pieNum=0;
	this.dataColsNum=0;

	//set in setStageScales
	this.stage;
	this.stageEntities;
	this.stageXScale;
	this.stageYScale;
	this.setStageScales(); //set scales and axis of the stage;




	this.checkIfShared(); //checks if the project is shared and starts watching for changes if so

	this.getStageX=function(xPos){
		
		return Math.round(this.stageXScale(xPos)+this.stageMarginLeft);
	};
	this.getStageY=function(yPos){
		return Math.round(this.stageYScale(yPos)-this.stageMarginBot);
	};
	//wait till all data sets are loaded through d3.csv
	this.evt = new CustomEvent('allDataSetsLoaded');
    
    // On mouse move track position with respect to stage scale
    this.stage.on("mousemove", function() {
      var coords = d3.mouse(this);
      $("#infoStageX").html(self.getStageX(coords[0])-2*(self.stageMarginLeft)); //invert doesn't make a diff here as range and domain are the same
      $("#infoStageY").html(self.getStageY(coords[1]));	//invert doesn't make a diff here as range and domain are the same
   	 }); 
	
	//make and add dataset object for each entry in pdataSets
	for(var i=0;i<pdataSets.length;i++){
		
		this.NumberOfDataSets+=pdataSets[i].cols;
		//get the associated cols
		
		
		var dataset=new Dataset(pdataSets[i].name,pdataSets[i].path,pdataSets[i].iddata_sets,pdataSets[i].type); //.path is just the filename not the entire path
		dataset.addDataset(this.pid); //dataset object
		//this.addDataSet(dataset); //add to project object
	}
	
	function getDataColsCallback(data){
		dataCols=data;
	}

	/**
	*@desc: Loads  pScales object which is fetched form the DB to the client side of the project
	*/
	function loadScalesDBToMem(){
		//make and add Scale object for each entry in pScales i.e server fetch scales
		for(var i=0;i<pScales.length;i++){
			console.log("scalei ",i,pScales);
			var scale=new Scale(pScales[i].idScales,pScales[i].pid,pScales[i].scale_name,pScales[i].type,pScales[i].col_Id,pScales[i].width,pScales[i].bandpadding,pScales[i].range_from,pScales[i].range_to)
			scale.addScale();
		}
	}

	/**
	*@desc:Loads pAxes object which is fetched form the DB to the client side of the project
	*/
	function loadAxesDBToMem(){
		//console.log('pAxes ',pAxes);
		for(var i=0;i<pAxes.length;i++){

			var axes=new Axes(pAxes[i].idaxes,pAxes[i].name,pAxes[i].orient,pAxes[i].X_pos,pAxes[i].Y_pos,pAxes[i].idScales,pAxes[i].ticks,pAxes[i].labelAngle,pAxes[i].textAnchor);
			//console.log("i",i,"axes ",axes);
			axes.addAxes();
		}
	}

	/**
	*@desc:Loads rect object which are fetched form the DB to the client side of the project
	*/
	function loadRectsDBToMem(){
		//console.log('pRects ',pRects);
		for(var i=0;i<pRects.length;i++){

			var rect=new Rectangle(pRects[i].rect_name,pRects[i].Width,pRects[i].Height,pRects[i].X_pos,pRects[i].Y_pos,pRects[i].Color,pRects[i].Opacity,pRects[i].idRectangle,pRects[i].Offset_X,pRects[i].Offset_Y,pRects[i].iddata_sets,pRects[i].widthScale,pRects[i].heightScale,pRects[i].XScale,pRects[i].YScale);
			//console.log("i",i,"axes ",axes);
			rect.addRect();
		}
	}


	/**
	*@desc:Loads circle object which are fetched form the DB to the client side of the project
	*/
	function loadCirclesDBToMem(){
		//console.debug('pCircles ',pCircles);
		for(var i=0;i<pCircles.length;i++){
			var circle=new Circle(pCircles[i].cir_name,pCircles[i].radius,pCircles[i].X_pos,pCircles[i].Y_pos,pCircles[i].Color,pCircles[i].Opacity,pCircles[i].idCircle,pCircles[i].iddata_sets,pCircles[i].radiusScale,pCircles[i].XScale,pCircles[i].YScale);
			//console.log("i",i,"circle ",pCircles[i]);
			circle.addCircle();
		}
	}

		/**
	*@desc:Loads pie object which are fetched form the DB to the client side of the project
	*/
	function loadPiesDBToMem(){
		//console.debug('pCircles ',pCircles);
		for(var i=0;i<pPies.length;i++){
			var pie=new Pie(pPies[i].idpie,pPies[i].piename,pPies[i].X_pos,pPies[i].Y_pos,pPies[i].Opacity,pPies[i].innerRadius,pPies[i].outerRadius,pPies[i].labelRadius,pPies[i].LabelCol,pPies[i].valueCol,pPies[i].iddata_sets,pPies[i].datasetName,pPies[i].cornerRadius,pPies[i].paddingAngle);
			pie.addPie();

		}
	}

	/**
	*@desc:Loads text object which are fetched form the DB to the client side of the project
	*/
	function loadTextsDBToMem(){
		//console.debug('pCircles ',pCircles);
		for(var i=0;i<pTexts.length;i++){
			var text=new Text(pTexts[i].name,pTexts[i].label,pTexts[i].size,pTexts[i].angle,pTexts[i].X_pos,pTexts[i].Y_pos,pTexts[i].Color,pTexts[i].opacity,pTexts[i].idtext,pTexts[i].iddata_sets,pTexts[i].sizeScale,pTexts[i].textScale,pTexts[i].XScale,pTexts[i].YScale);
			text.addText();

		}
	}







	
	



	


	//////////////////////////////////////////
	//Data set event listeners
	///////////////////////////////////////////
	////data loaded event
	window.addEventListener('allDataSetsLoaded', function (e) {
		loadScalesDBToMem(); //load scales data
		loadAxesDBToMem();//load axes
		loadRectsDBToMem();//load rect
		loadCirclesDBToMem();//load circles
		loadPiesDBToMem();//load pies
		loadTextsDBToMem();//load texts
	});


	//toggle view data columns
	$(document).on('click','.dataset',function(){
	  $(this).find('li').toggle();
	});


     

}

//any click on body
$('html').click(function() {
 	deselectEntities();
 });
//group list event listener
//select group item on click
$(document).on('click','.groupItem',function(){
	var entityId=$(this).data().entityid;	//actual id
	var entityType=$(this).data().entitytype; //axes,rect etc
	var entityName=entityType+entityId;
	var entity;
	
	selectEntity(entityId,entityType);

});

//show hide rulers
$('#showHideRulerBtn').click(function(){
	
	if($(this).text()==="Hide Rulers"){
		$(this).text("Show Rulers");
		$(".stageAxis").hide();
	}
	else if($(this).text()==="Show Rulers"){
		$(this).text("Hide Rulers");
		$(".stageAxis").show();	
	}
})
//show hide json structure in file upload
$("#showHideJsonStrucBtn").click(function(){
	if($(this).text()==="Show"){
		$(this).text("Hide");
		$("#jsonDemoStruc").show();
	}
	else if($(this).text()==="Hide"){
		$(this).text("Show");
		$("#jsonDemoStruc").hide();	
	}
});

function deselectEntities(){
	$('.groupItem').css('background-color',''); //remove previous(all) backgroud selected
	$(".d3Entity").attr("stroke",""); //clear previous stroke	
	$(".entityInfo").hide(); //hide info elements
}

//Select an entity on stage and in group
function selectEntity(entityId,entityType){
	var entityName=entityType+entityId;
	var entity;
	//deselect previous
	deselectEntities();
	//make group item look selected
	$("#Li"+entityType+entityId).css('background-color','#7f8a9b');	//add background to selected
	
	
	switch (entityType){
		case "axes":
			entity=project.axes[entityName];
			$("#d3Axes"+entityId).attr("stroke","gray"); //draw a stroke around the element to let know its select
		break;
		case "rect":
			entity=project.rect[entityName];
			$("#d3Rect"+entityId).attr("stroke","gray"); //draw a stroke around the element to let know its select
		break;
		case "circle":
			entity=project.circle[entityName];
			$("#d3Circle"+entityId).attr("stroke","gray"); //draw a stroke around the element to let know its select
		break;
		case "pie":
			entity=project.pie[entityName];
			$("#d3Pie"+entityId).attr("stroke","gray"); //draw a stroke around the element to let know its select
		break;
		case "text":
			entity=project.text[entityName];
			$("#d3Text"+entityId).attr("stroke","gray"); //draw a stroke around the element to let know its select
		break;
		default:
			console.error("invalid entity type");
	}
	$(".entityInfo").show();  //sho info elements
	//update info box
	$('#entityNameInfo').html(entity.name);
	$('#entityTypeInfo').html(entity.type);
}

//takes range input 0 to 100 and converts to 0 to 1 output and populates an  outputID ele
function setOutput(rangeInput,outputID){
	var rangeInputEle=$(rangeInput);
	var rangeOutputEle=$("#"+outputID);
	var outputRange=((parseInt(rangeInputEle.val())*0.01)).toFixed(2);
	rangeOutputEle.val(outputRange);
}

//Embedable modal opened event
//triggered when modal is about to be shown
$('#embedModal').on('show.bs.modal', function(e) {
	console.debug($("#embedableOp"));
	$("#embedableOp").text("<svg width='900px' height='500px'>"+$('#stageEntities').html()+"</svg>");

	//trying to select text ,doesn't work
	if (window.getSelection && document.createRange) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents($("#embedableOp")[0]);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText($("#embedableOp")[0]);
        range.select();
    }
});

//Export modal opened event
//triggered when modal is about to be shown
$('#exportModal').on('show.bs.modal', function(e) {
	//load a svg snippet in the canvas with id = 'canvas1'
  	canvg(document.getElementById('canvas1'), "<svg width='900px' height='500px'>"+$('#stageEntities').html()+"</svg>")

});

function updateProjectCallback(data){
	console.log(data);
}


Project.prototype={
		constructor:Project,
		addDataSet:function(ds){
			var datasetName = ds.name.slice(0,-4);  //ignore .csv at the end of ds.name
			this.datasets[datasetName]=(ds); 
		},
		setStageScales:function(){
			

			//set project stage
			this.stage=d3.select("#stageDiv").append("svg").attr("width",this.stageWidth).attr("height",this.stageHeight);
			this.stageEntities=this.stage.append("g").attr("id","stageEntities");
			//Set project scale
			//Xscale
			this.stageXScale=d3.scaleLinear()            
							.domain([0,this.stageWidth])
							.range([0,this.stageWidth]);
							
			var stageXAxis = d3.axisBottom(this.stageXScale)   	//let axis be private
							.ticks(20);
			

	        //Y scale  
	        this.stageYScale=d3.scaleLinear()
							.domain([this.stageHeight,0])
							.range([0,this.stageHeight]);

			var stageYAxis = d3.axisLeft(this.stageYScale)
			.ticks(20);

			///Add to screen
			//YAxis    
			this.stage.append("g")
	        	.attr("class", "axis stageAxis")
	        	.attr("transform", "translate("+this.getAxisX(0,"Left",0)+","+this.getAxisY(0,"Left",0,this.stageHeight)+")")
	            .call(stageYAxis); 
			//XAxis
			this.stage.append("g")
	        	.attr("class", "axis stageAxis")
	            .attr("transform", "translate("+this.getAxisX(0,"Bottom",0)+","+this.getAxisY(0,"Bottom",0,this.stageWidth)+")")
	           	.call(stageXAxis);

		},
		getAxisX:function(axisX,axisOrient,rangeFrom){
			if(axisOrient==="Left" || axisOrient==="Right"){
				var stageX=parseInt(axisX)+this.stageMarginLeft;  			//no need to compensate for vertical axis
			}
			else if(axisOrient==="Bottom" || axisOrient==="Top"){
				var stageX=parseInt(axisX)+this.stageMarginLeft-rangeFrom;  //axes is offeset with the rangeFrom by d3 so we compensate here
			} 
			else{
				console.error("invalid axis orient");
			}  
			
			return stageX;
		},
		getAxisY:function(axisY,axisOrient,rangeFrom,axisLength){
			var stageY;
			//differently oriented axis have different origin point and y start from top in svg
			if(axisOrient==="Top" || axisOrient==="Bottom"){
				
				stageY=this.stageHeight-parseInt(axisY)-this.stageMarginBot;
				return stageY;
			}
			else if(axisOrient==="Left" || axisOrient==="Right"){
				stageY=this.stageHeight-parseInt(axisY)-axisLength-this.stageMarginBot-rangeFrom;//stage height- Y -scaleLenth(since origin is at topleft not botleft) -rangeFrom to cmpensate for d3s offset
				//stageY=-(parseInt(axisY)+this.stageMarginBot+(2*this.stageBorder));
				return stageY;
			}
			else{
				console.error("invalid axis orient");
			}
			
		},
		checkIfBeingEdited:function(){
			var self=this;
			console.log("checking..");
			setTimeout(self.checkIfBeingEdited,3000);
		},

		checkIfShared:function(){
		var isShared;
		var self=this;
		ajaxCall('get','projects/isShared/'+this.pid,'','text',isSharedCallback);
		
		function isSharedCallback(data){
			console.log(data);
			self.isShared=(data==="true")?true:false;
			var timer;
			var refresh=false;
			
			//start heart beat if project is shared
			if(self.isShared){
				checkIfBeingEdited();

				function checkIfBeingEdited(){
					ajaxCall('get','projects/checkForEdits/'+self.pid,'','text',checkIfBeingEditedCallback,true);
					console.log("checking for edits..");
					timer=setTimeout(checkIfBeingEdited,3000);
				}

				function checkIfBeingEditedCallback(editInfo){

					var editInfo=JSON.parse(editInfo);
					var editDiff=editInfo.secondsSinceLastEdit;
					var editBy=editInfo.editedByName;
					var editById=editInfo.editedById;
					var currentUser=editInfo.currentUser;
					var overlayText=editBy+" is editing the project";
					//console.log("difference ",editInfo.secondsSinceLastEdit);

					//some one recently made an edit in past 10 seconds and that someone is not not me
					if(editDiff<10 && editById != currentUser){
						//block screen
						$("#sharedEdit").css("display", "block");

						$("#editByOverlayText").html(overlayText);
						refresh=true;
					}
					else{
						//unblock screen and refresh to show changes 
						$("#sharedEdit").css("display", "none");//not really required as we reload anyways
						if(refresh){
							window.location.reload();
						}
						
					}
				}
			}
		}
		
		
	}
}