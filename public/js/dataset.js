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
			var colName1;
			var colType;
			var colData;
			var dataColObj;
			var datasetId=self.id;
  			console.log('storageDAta:',data);

  			self.rawData=data;

  			for(var i=0;i<data.columns.length;i++){
  				console.log('col ',data.columns[i]);
  				colName=data.columns[i];
  				colName1=
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




