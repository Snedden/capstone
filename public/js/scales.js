

(function Scales(){
	 
    setStageScales();
     
	

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

})();