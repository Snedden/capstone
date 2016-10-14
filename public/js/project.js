function Project(pid,puid,pname,pdataSets,pScales,pAxes){
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

	
	
	//make and add dataset object for each entry in pdataSets
	for(var i=0;i<pdataSets.length;i++){
		
		this.NumberOfDataSets+=pdataSets[i].cols;

		var dataset=new Dataset(pdataSets[i].name,pdataSets[i].path,pdataSets[i].iddata_sets); //.path is just the filename not the entire path
		this.addDataSet(dataset);
	}
	

	//wait till all data sets are loaded through d3.csv
	this.evt = new CustomEvent('allDataSetsLoaded');
	
	/**
	*Loads  pScales object which is fetched form the DB to the client side of the project
	*/
	function loadScalesDBToMem(){
		//make and add Scale object for each entry in pScales i.e server fetch scales
		for(var i=0;i<pScales.length;i++){
			
			var scale=new Scale(pScales[i].idScales,pScales[i].pid,pScales[i].scale_name,pScales[i].type,pScales[i].col_Id,pScales[i].width,pScales[i].bandpadding,pScales[i].range_from,pScales[i].range_to)
			scale.addScale();
		}
	}

	/**
	*Loads pAxes object which is fetched form the DB to the client side of the project
	*/
	function loadAxesDBToMem(){
		console.log('pAxes ',pAxes);
		for(var i=0;i<pAxes.length;i++){

			var axes=new Axes(pAxes[i].idaxes,pAxes[i].name,pAxes[i].orient,pAxes[i].X_pos,pAxes[i].Y_pos,pAxes[i].idScales,pAxes[i].ticks);
			console.log("i",i,"axes ",axes);
			axes.addAxes();
		}
	}
	
	



	setStageScales(); //set scales and axis of the stage


	//////////////////////////////////////////
	//Data set event listeners
	///////////////////////////////////////////
	////data loaded event
	window.addEventListener('allDataSetsLoaded', function (e) {
		loadScalesDBToMem(); //load scales data
		loadAxesDBToMem();
	});


	//toggle view data columns
	$(document).on('click','.dataset',function(){
	  $(this).find('li').toggle();
	});

	//dataset modle open
	//triggered when modal is about to be shown
	$('#datasetModal').on('show.bs.modal', function(e) {
	    $("#dataSetColsList").empty(); //clear previous
	    //get data-id attribute of the clicked element
	    var datasetId = $(e.relatedTarget).data('dataset-id');
	    var datasetName = $(e.relatedTarget).data('dataset-name');
	    var pid = $(e.relatedTarget).data('project-id');

	    //populate the textbox
	    $(e.currentTarget).find('#datasetName').html(datasetName);
	    $(e.currentTarget).find('#deleteDatasetBtn').attr('data-id',datasetId);
	    $(e.currentTarget).find('#deleteDatasetBtn').attr('data-pid',pid);

	    
	    ajaxCall('get','dataset/columns/'+datasetId,null,'json',datasetColumnCallback); 
	});

	function datasetColumnCallback(data){

		 for (col in data){

		    $("#dataSetColsList").append('<li>'+
		                                    '<input type="text" id="col_name" placeholder="columnname" value="'+data[col].col_name+'"></input>'+ 
		                                    '<select >'+
		                                      '<option value="String" '+isString(data[col].col_type)+'>String</option>'+
		                                      '<option value="Number" '+isNumber(data[col].col_type)+'>Number</option>'+
		                                    '</select>'+
		                                    '<input type="hidden" id="col_id" placeholder="columnname" value="'+data[col].col_Id+'"></input>'+ 
		                                    '</li>');

		 }

	  //functions to see if its type number or string in dataset columns
	  function isString(type){
	    if(type=="String")
	    {
	      return 'selected';
	    }
	    
	  }
	  function isNumber(type){
	    if(type=="Number"){
	      return 'selected';
	    }
	    
	  }
	}

	//Update dataset column button clicked
	$(document).on('click','#updateDatasetBtn',function(){
	  var dataCols=[];

	  $("#dataSetColsList li").each(function(index){
	    console.log($(this).find('#col_name').val());
	    var col={
	      col_name:$(this).find('#col_name').val(),
	      col_type:$(this).find('select').val(),
	      col_id:$(this).find('#col_id').val()

	    };
	    
	    dataCols.push(col);
	  });  

	  //update in database
	  ajaxCall('post','datasetColumns/update',dataCols,'text',datasetColumnUpdateCallback); 
	});

	function datasetColumnUpdateCallback(data){
	  console.log(data);
	}





	//delete dataset button click
	$(document).on('click','#deleteDatasetBtn',function(){
	  console.log($(this).attr('data-id'));
	  var postData={
	    iddata_sets:$(this).attr('data-id'),
	    pid:$(this).attr('data-pid')
	  };
	  console.log(postData);
	  ajaxCall('post','dataset/delete',postData,'text',deleteDataSetCallBack); 
	});

	function deleteDataSetCallBack(data){
	  
	  location.reload();
	}



     
	/////////////////////////////////////////////////
	//Set the scales and axix of the stage of the project
	//////////////////////////////////
	function setStageScales(){
	
		var stageWidth=$("#stageDiv").width();
		var stageHeight=$("#stageDiv").height();
		var stage=d3.select("#stageDiv").append("svg").attr("width",stageWidth).attr("height",stageHeight);

		var paddingLeft=30;
		var paddingBot=20;

		//X axis
		var stageXScale=d3.scaleLinear()
						.domain([0,stageWidth])
						.range([0,stageWidth]);
		var stageXAxis = d3.axisBottom(stageXScale)
						.ticks(20);
		stage.append("g")
        	.attr("class", "axis")
            .attr("transform", "translate("+paddingLeft+","+(stageHeight-paddingBot)+")")
            .call(stageXAxis);

        //Y axis  
        var stageYScale=d3.scaleLinear()
						.domain([0,stageHeight])
						.range([stageHeight,0]);
		var stageYAxis = d3.axisLeft(stageYScale)
		.ticks(20);
		stage.append("g")
        	.attr("class", "axis")
            .attr("transform", "translate("+paddingLeft+","+(-paddingBot)+")")
            .call(stageYAxis); 


        // On mouse move track position with respect to stage scale
        stage.on("mousemove", function() {
          var coords = d3.mouse(this);
          //console.log("X:",(stageXScale.invert(coords[0]))-(paddingLeft),"Y:",(stageYScale.invert(coords[1]))-(paddingBot));
          $("#infoStageX").html(Math.round((stageXScale.invert(coords[0]))-(paddingLeft)));
          $("#infoStageY").html(Math.round((stageYScale.invert(coords[1]))-(paddingBot)));	
         });  
        
             			
    }
}

Project.prototype={
		constructor:Project,
		addDataSet:function(ds){
			var datasetName = ds.name.slice(0,-4);  //ignore .csv at the end of ds.name
			this.datasets[datasetName]=(ds); 
		}
}