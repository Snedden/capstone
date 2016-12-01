function Dataset(dName,dFileName,dId,type){
	this.name=dName;
	this.path='../devStorage/'+dFileName;  //have to change in online server
	this.id=dId;
	this.rawData;
	this.type=type;

	this.dataCols=[];
	this.dataColumns;

	this.jqueryObj=$('.dataset#'+this.id);
	this.pid;




}

function handleData(data,self){
	var colName;
	var colName1;
	var colType;
	var colData={};
	var dataColObj;
	var datasetId=self.id;
	var datasetName='dataset'+self.id;
	var dataColumns;
		
		for(var  key in data[0]){
			console.log('key ',key);
		}
		
		self.rawData=data;

		//for(var i=0;i<data.columns.length;i++){
		for(var  key in data[0]){	
			//console.log('col ',data.columns[i]);
			//colName=data.columns[i];
			colName=key;
			
			colType=isNaN(data[0][colName])?'String':'Number';
			colData[colName]=[];

			for(var j=0;j<data.length;j++){
				//make sure to parse as int if number
				if(colType==='Number'){
					colData[colName].push(parseInt(data[j][colName]));
				}
				else{
					colData[colName].push(data[j][colName]);
				}
				
			}

			//add column obect
			dataColObj=new Datacol(colName,colType,colData,datasetId);
			self.dataCols[colName]=dataColObj;


			
      //count loaded dataset and add to memory
      project.dataSetLoaded++;
      project.datasets[datasetName]=self; 
      

		}

	//add data columns 
	for(var i=0;i<self.dataColumns.length;i++){

		var dataCol=new Datacol(self.dataColumns[i].col_Id,self.dataColumns[i].col_name,self.dataColumns[i].col_type,colData[self.dataColumns[i].col_name],self.id);
		project.dataCols[dataCol.dataColName]=dataCol;
	}
	//dispatch event if all data sets are loaded
	if(project.dataSetLoaded===project.NumberOfDataSets){
        window.dispatchEvent(project.evt);
     }
}

Dataset.prototype={
	constructor:Dataset,
	addDataset:function(pid){
		this.pid=pid;
		this.getDataCols();
	},
	addFileData:function(){
		var self=this;
		console.log('ds ',this);
		if(self.type==='json'){
			d3.json(this.path+".json", function(data) {
				console.log('jsondata ',data);
  				handleData(data,self);
			});
		}
		else if(self.type==='csv'){
			d3.csv(this.path+".csv", function(data) {
				console.log('csvdata ',data);
				handleData(data,self);
			});
		}
		else{
			console.error("Invalid dataset type");
		}

	},
	addToStage:function(){
		var dataColLi,dataSetLi;
	    dataSetLi="<li class='dataset' data-col-id="+this.id+" id="+this.id+">"+this.name+" <a style='float:right;font-size:9px' href='#'' class='btn btn-xs btn-primary' data-toggle='modal' data-target='#datasetModal' data-dataset-name="+this.name+" data-project-id="+this.pid+"  data-dataset-id="+this.id+">edit</a><ul id='dataColUl"+this.id+"'></ul></li>";
	     $("#dataSetUL").append(dataSetLi);
	        
 		//add to rect modal
		var dsOpRect="<option  value="+this.id+">"+this.name+"</option>";
		$("#rectDataset").append(dsOpRect);

 		//add to circle modal
		var dsOpCircle="<option  value="+this.id+">"+this.name+"</option>";
		$("#circleDataset").append(dsOpCircle);
 		
 		//add to pie modal
		var dsOpPie="<option  value="+this.id+">"+this.name+"</option>";
		$("#pieDataset").append(dsOpPie);

 		//add to text modal
		var dsOpText="<option  value="+this.id+">"+this.name+"</option>";
		$("#textDataset").append(dsOpText);					                    

           
	},
	addDataCol:function(){
		
	},
	getDataCols:function(){
		ajaxCall('get','dataset/columns/'+this.id,'','json',getDataColsCallback);
		var self=this;
		function getDataColsCallback(data){
			self.dataColumns=data;
			self.addFileData(this.pid);
			self.addToStage(this.pid); 
		}
	}
}

///Data column object
function Datacol(id,colName,colType,colData,datasetId){
	this.id=id;
	this.name=colName;
	this.type=colType;
	this.data=colData;
	this.datasetId=datasetId;
	this.dataColName='dataCol'+this.id;
	project.dataColsNum++;

	this.scales=[];

	//this.jqueryObj=$('.dataset#'+this.datasetId+' #'+this.name);

	//add to screen
    var dataColLi="<li data-toggle='modal' data-datacolnum="+project.dataColsNum+" data-col-id="+this.id+" data-target='#addScaleModal' data-datasetcol-name="+this.name+" data-action='add'  id="+this.id+">"+this.name+"</li>";
  	$("#dataColUl"+this.datasetId).append(dataColLi);

 
  	
	
}

///////////////submit events

$("#datasetUploadForm").submit(function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	if(!window.File && window.FileReader && window.FileList && window.Blob){ //if browser doesn't supports File API
        alert("Your browser does not support new File API! Please upgrade.");
    	return false;
    }
	console.debug($('#csv'));
	var formData = new FormData();
	formData.append('file', $('#csv')[0].files[0]);

	//Not using ajax.js as too many different variable to re factor 
	$.ajaxSetup({
        headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        
    }
    });
    $.ajax({

        type: 'POST',
        //url: window.location.origin+'/projectFirst/public/'+url,
        url: window.location.origin+'/'+'dataset/create/'+project.pid,
        data:formData,
       
    	processData:false,
    	contentType:false,
    	mimeType:"multipart/form-data",
        success: function (data) {
            //console.log(data);
            uploadDataCallback(data);

        },
        error: function (data) {
            console.error('Error:', data);
        }
    });
    $("#fileUploadModal").modal('hide');//close modal dialog
});

function uploadDataCallback(data){
	//console.log(JSON.parse(data.split('</pre>')[1]));
	var ret=JSON.parse(data); 
	var dataset=new Dataset(ret.name,ret.path,ret.iddata_sets);
	dataset.addDataset(project.pid);
}



