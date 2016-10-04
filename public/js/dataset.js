function Dataset(dName,dFileName,dId){
	this.name=dName;
	this.path='../devStorage/'+dFileName;  //have to change in online server
	this.id=dId;

	this.dataCols=[];

	this.jqueryObj=$('.dataset#'+this.id);
	this.addFileData();




}

Dataset.prototype={
	constructor:Dataset,
	addFileData:function(){
		d3.csv(this.path+".csv", function(data) {
			var colName;
			var colType;
			var colData;
  			console.log('storageDAta:',data);

  			for(var i=0;i<data.columns.length;i++){
  				console.log('col ',data.columns[i]);
  				colName=data.columns[i];
  				colType=isNaN(data[0][colName])?'String':'Number';
  				colData=[];
  				for(var j=0;j<data.length;j++){
  					colData.push(data[j][colName]);
  				}

  				console.log("name:",colName," type:",colType," data:",colData);
  			}
		});
	},
	addDataCol:function(){

	}
}

function Datacol(){
	this.name;
	this.type;
	this.data;
}