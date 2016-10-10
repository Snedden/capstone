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

Datacol.prototype={
	constructor:Datacol,
	addScale:function(scale){ //scale is Scale object
		var scaleName="scale"+scale.scaleId;
		this.scales[scaleName]=scale;	
		
		
	}
}


//Event listeners
//add scale modle open
//triggered when modal is about to be shown
$('#addScaleModal').on('show.bs.modal', function(e) {
    
    //get data-id attribute of the clicked element
    var datasetName = $(e.relatedTarget).data('dataset-name');


    datasetName=datasetName.slice(0,-5); //ignore csv
    var datasetCol = $(e.relatedTarget).data('datasetcol-name');
    var dataColId=$(e.relatedTarget).attr("id");
    var datasetColObj=project.datasets[datasetName].dataCols[datasetCol];
    var scaleType=(datasetColObj.type==="Number"?"Linear":"Ordinal");
    var scaleName=datasetName+"_"+datasetColObj.name+"_scale";
    var ordinalDomain="";

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
    


    //console.log(datasetName," ",datasetCol," ",datasetColObj);
    

    //populate the textbox
    $(e.currentTarget).find('#dataScaleName').val(scaleName);
    $(e.currentTarget).find('#dataColType').val(scaleType);
    $(e.currentTarget).find('#dataColDomainFrom').val(d3.min(datasetColObj.data));
    $(e.currentTarget).find('#dataColDomainTo').val(d3.max(datasetColObj.data));
    $(e.currentTarget).find('#dataColId').val(dataColId);
    $(e.currentTarget).find('#domainOrdinal').val(ordinalDomain);
    

    
   
});