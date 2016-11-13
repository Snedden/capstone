function Dataset(dName,dFileName,dId,dataCols){
	this.name=dName;
	this.path='../devStorage/'+dFileName;  //have to change in online server
	this.id=dId;
	this.rawData;

	this.dataCols=[];
	this.dataColumns=dataCols;

	this.jqueryObj=$('.dataset#'+this.id);
	this.pid;




}

Dataset.prototype={
	constructor:Dataset,
	addDataset:function(pid){
		this.pid=pid;
		this.getDataCols();
	},
	addFileData:function(){
		var self=this;
		d3.csv(this.path+".csv", function(data) {
			var colName;
			var colName1;
			var colType;
			var colData={};
			var dataColObj;
			var datasetId=self.id;
			var datasetName='dataset'+self.id;
  			console.log('storageDAta:',data);

  			self.rawData=data;

  			for(var i=0;i<data.columns.length;i++){
  				console.log('col ',data.columns[i]);
  				colName=data.columns[i];
  				
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
		});
	},
	addToStage:function(){
		var dataColLi,dataSetLi;
	    dataSetLi="<li class='dataset' data-col-id="+this.id+" id="+this.id+">"+this.name+" <a style='float:right;font-size:9px' href='#'' class='btn btn-xs btn-primary' data-toggle='modal' data-target='#datasetModal' data-dataset-name="+this.name+" data-project-id="+this.pid+"  data-dataset-id="+this.id+">edit</a><ul id='dataColUl"+this.id+"'></ul></li>";
	     $("#dataSetUL").append(dataSetLi);
	        
        for(var i = 0; i<this.dataColumns.length; i++){
          	var dataColLi="<li data-toggle='modal' data-dataset-name="+this.name+"  data-target='#addScaleModal' data-datasetcol-name="+this.dataColumns[i].col_name+" data-action='add'  id="+this.dataColumns[i].col_Id+">"+this.dataColumns[i].col_name+"</li>";
          	$("#dataColUl"+this.id).append(dataColLi);
         }
	                    

           
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

	this.scales=[];

	this.jqueryObj=$('.dataset#'+this.datasetId+' #'+this.name);
	
}

///////////////submit events
//update pie
$("#datasetUploadForm").submit(function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	if(!window.File && window.FileReader && window.FileList && window.Blob){ //if browser doesn't supports File API
        alert("Your browser does not support new File API! Please upgrade.");
    	return false;
    }
	
	var formData = new FormData($("#datasetUploadForm")[0]);
	formData.append('csv', $('#csv'));
	//ajaxCall('post','dataset/create/'+project.pid,formData,'json',uploadDataCallback,true);
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
        dataType:'text',
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
	var ret=JSON.parse(data.split('</pre>')[1]); //need to do this as cant get propoer json response for file upload
	var dataset=new Dataset(ret.name,ret.path,ret.iddata_sets);
	dataset.addDataset(project.pid);
}



