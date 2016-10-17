function Dataset(dName,dFileName,dId){
	this.name=dName;
	this.path='../devStorage/'+dFileName;  //have to change in online server
	this.id=dId;
	this.rawData;

	this.dataCols=[];

	this.jqueryObj=$('.dataset#'+this.id);
	this.addFileData();




}

Dataset.prototype={
	constructor:Dataset,
	addFileData:function(){
		var self=this;
		d3.csv(this.path+".csv", function(data) {
			var colName;
			var colType;
			var colData;
			var dataColObj;
			var datasetId=self.id;
  			console.log('storageDAta:',data);

  			self.rawData=data;

  			for(var i=0;i<data.columns.length;i++){
  				console.log('col ',data.columns[i]);
  				colName=data.columns[i];
  				colType=isNaN(data[0][colName])?'String':'Number';
  				colData=[];

  				for(var j=0;j<data.length;j++){
  					//make sure to parse as int if number
  					if(colType==='Number'){
  						colData.push(parseInt(data[j][colName]));
  					}
  					else{
  						colData.push(data[j][colName]);
  					}
  					
  				}

  				//add column obect
  				dataColObj=new Datacol(colName,colType,colData,datasetId);
  				self.dataCols[colName]=dataColObj;

          //count the number of data sets loaded
          project.dataSetLoaded++;
          //dispatch event if all data sets are loaded
          if(project.dataSetLoaded===project.NumberOfDataSets){
            window.dispatchEvent(project.evt);
          }
  			}
		});
	},
	addDataCol:function(){

	}
}

///Data column object
function Datacol(colName,colType,colData,datasetId){
	this.name=colName;
	this.type=colType;
	this.data=colData;
	this.datasetId=datasetId;

	this.scales=[];

	this.jqueryObj=$('.dataset#'+this.datasetId+' #'+this.name);
	
}




//Event listeners
//add scale modle open
//triggered when modal is about to be shown
$('#addScaleModal').on('show.bs.modal', function(e) {

    var action = $(e.relatedTarget).data('action');
    
    //get data-id attribute of the clicked element
    var datasetName = $(e.relatedTarget).data('dataset-name');


    datasetName=datasetName.slice(0,-4); //ignore csv
    var datasetCol = $(e.relatedTarget).data('datasetcol-name');
    var dataColId=$(e.relatedTarget).attr("id");
    var datasetColObj=project.datasets[datasetName].dataCols[datasetCol];
    var scaleType=(datasetColObj.type==="Number"?"Linear":"Ordinal");
    var scaleName=datasetName+"__"+datasetColObj.name+"__scale"; //two underscore as delimeters to mitigate just incase if column name have underscores
    var ordinalDomain="";

    var scaleId,scaleName,scaleObj,rangeFrom,rangeTo,width,padding;

    var ordinalRangeInput=document.getElementById('scaleBandPaddingOrdinal');
    setOutputBandpadding(ordinalRangeInput); //set default to 0.1

    //toggle inputs based on input types
    if(scaleType==="Linear"){
    	$(".linearScaleInput").show();
    	$(".ordinalScaleInput").hide();
    }
    else if(scaleType==="Ordinal"){
    	$(".linearScaleInput").hide();
    	$(".ordinalScaleInput").show();

    	for(var i=0;i<datasetColObj.data.length;i++){
    		ordinalDomain=ordinalDomain+datasetColObj.data[i]+",";
    	}
    }
    //add or update scale
    if(action==="add"){
      //enable them back
      $(e.currentTarget).find("#addScaleBtn").prop("disabled",false);
      $(e.currentTarget).find("#range_from").prop("disabled",false);
      $(e.currentTarget).find("#range_to").prop("disabled",false);
      $(e.currentTarget).find("#scaleBandPaddingOrdinal").prop("disabled",false);
      $(e.currentTarget).find("#scaleWidthOrdinal").prop("disabled",false);

      $(e.currentTarget).find("#addScaleBtn").html("Add");
    }
    else if(action==="update"){
      //disable them for now
      $(e.currentTarget).find("#addScaleBtn").prop("disabled",true);
      $(e.currentTarget).find("#range_from").prop("disabled",true);
      $(e.currentTarget).find("#range_to").prop("disabled",true);
      $(e.currentTarget).find("#scaleBandPaddingOrdinal").prop("disabled",true);
      $(e.currentTarget).find("#scaleWidthOrdinal").prop("disabled",true);

      scaleId=$(e.relatedTarget).data('scale-id');
      scaleName="scale"+scaleId;
      scaleObj=project.scales[scaleName];
      if(scaleType==="Linear"){
        $(e.currentTarget).find("#range_from").val(scaleObj.rangeFrom);
        $(e.currentTarget).find("#range_from").val(scaleObj.rangeFrom);
      }
      else if(scaleType==="Ordinal"){
        $(e.currentTarget).find("#scaleWidthOrdinal").val(scaleObj.width);
        $(e.currentTarget).find("#scaleBandPaddingOrdinal").val(scaleObj.padding);
      }
      
      
      $(e.currentTarget).find("#addScaleBtn").html("Update");




    }
    else{
      console.error("invalid action type in addScaleModal");
    }
    
    //populate the textbox
    $(e.currentTarget).find('#dataScaleName').val(scaleName);
    $(e.currentTarget).find('#dataColType').val(scaleType);
    $(e.currentTarget).find('#dataColDomainFrom').val(d3.min(datasetColObj.data));
    $(e.currentTarget).find('#dataColDomainTo').val(d3.max(datasetColObj.data));
    $(e.currentTarget).find('#dataColId').val(dataColId);
    $(e.currentTarget).find('#domainOrdinal').val(ordinalDomain);
    

    
   
});