function Text(name,text,size,angle,xPos,yPos,color,opacity,id,id_dataset,sizeScale,textScale,xPosScale,yPosScale){
  var XScaleName="scale"+xPosScale;
  var YScaleName="scale"+yPosScale;
  var textScaleName="scale"+textScale;
  var sizeScaleName="scale"+sizeScale;

  
  
  
  this.id=id; 
  this.type="Text";
  this.name=name;
  this.text=text;
  this.xPos=xPos;

  this.yPos=yPos;

  this.color=color;
  this.size=size;
  this.angle=angle;
  this.opacity=opacity;
  this.originX=0;     //origin is in percent; (0 ,0) is deafault; (100,0) shift X 100 percent of text (50,50) center the origin and so on..
  this.originY=0;   //origin is in percent 
  this.id_dataset=id_dataset;
  this.textScaleId=textScale;
  this.sizeScaleId=sizeScale;
  this.xPosScaleId=xPosScale;
  this.yPosScaleId=yPosScale;
  this.datasetName='dataset'+id_dataset;
  if(xPosScale){
    XScaleName="scale"+xPosScale;
    this.xPosScale=project.scales[XScaleName];
    this.rawData=project.datasets[this.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,text or size
  }
  if(yPosScale){
    YScaleName="scale"+yPosScale;
    this.yPosScale=project.scales[YScaleName];
    this.rawData=project.datasets[this.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,text or size
  }
  if(sizeScale){
    sizeScaleName="scale"+sizeScale;
    this.sizeScale=project.scales[sizeScaleName];
    this.rawData=project.datasets[this.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,text or size
  }
  if(textScale){
    textScaleName="scale"+textScale;
    this.textScale=project.scales[textScaleName];
    this.rawData=project.datasets[this.datasetName].rawData; //all scales belong to the same dataset so doens't matter which scale we choose x,y,text or size
  }

  this.originXShift=0;
  this.originYShift=0;
  this.textName="text"+this.id;
  this.d3TextId="d3Text"+this.id;
  
  


  
}


Text.prototype={
  addText:function(){
    //console.log("text ",data);
    var groupLi;  //list item in group list
  
    

    //add to memory
    project.text[this.textName]=this;
    project.textNum++;

    //add to screen
    groupLi="<div id=text"+this.id+"><li id=Litext"+this.id+"  class='groupItem textGroupItem' data-entityid="+this.id+" data-entitytype=text data-textid="+this.id+" >"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary textDelBtn'    data-text-id="+this.id+" >Delete</button>  </div>";
    $("#groupsUl").append(groupLi);       //add to list
    //////////add to stage 
    this.drawOnStage();

    


  },
  deleteText:function(id){
    var textObject=this;
    console.log('delete ', textObject);
    ajaxCall('post','text/delete',this.id,'text',textDelCallback);

    function textDelCallback(data){
      var textTobeDeleted='text'+textObject.id;
      var d3TextTobeDeleted='d3Text'+textObject.id;
        //delete form screen
        $("#"+textTobeDeleted).remove();      //list entry item
        $("#"+d3TextTobeDeleted).remove();    //rendered axis


      //delete from memory
        delete project.text[textTobeDeleted];                              //delete axes object
        
        
    }
  },
  updateText:function(){
    //console.log("text ",data);
    var groupLi;  //list item in group list

    //update to memory
    
    project.text[this.textName]=this;
    
    //update to screen
    groupLi="<div id=text"+this.id+"><li id=Litext"+this.id+" data-entityid="+this.id+" data-entitytype=text  class='groupItem textGroupItem' data-textid="+this.id+" >"+this.name+"</li><button style='float:right;font-size:9px'  class='btn btn-xs btn-primary textDelBtn'    data-text-id="+this.id+" >Delete</button></div> ";
    $("#text"+this.id).html(groupLi);       //update  list item
    //////////add to stage 
    //remove previous text
    d3.select("#"+this.d3TextId)
        .remove();
    this.drawOnStage();
    
            
  },
  drawOnStage:function(){
    
    //add new group     
    project.stageEntities.append("g")                 
            .attr("class", "text d3Entity")
                .attr("id",this.d3TextId);      
    if(!this.isBasic()){
      //update attributes
      this.drawLinkedText();


    }
    else{
      //update attributes
      this.drawBasicText(); 
    }
  },
  isBasic:function(){
    if(!this.textScale&&!this.sizeScale&&!this.xPosScale&&!this.yPosScale){
      return true;
    }   
      else{
        return false;
      }
  },
  drawBasicText:function(){
    //update attributes
      d3.select("#"+this.d3TextId)
        .append("text") //add new text
        .attr("font-size", this.size)
        .attr("fill",this.color)
        .attr("transform","rotate("+(-this.angle)+")")
        .attr("fill-opacity",(0.01*this.opacity))
        .text( this.text);
      //tranform to X and Y   
      d3.select("#"+this.d3TextId)
        .attr("transform", " translate("+(project.getStageX(this.xPos)-this.originXShift)+","+(project.getStageY(this.yPos)-this.originYShift)+")");
  },
  drawLinkedText:function(){
    var self=this;
    var cx=0; //x of each element
    var cy=0; //y of each element 
    d3.select("#"+this.d3TextId)
        .html("")  //remove previous text
        .selectAll(".textStream")
        .data(this.rawData)
          .enter().append("text") //add new text
          .text(function(d){

            if(self.textScale){
              return   d[self.textScale.dataCol.name];   
            }
            else{
              return self.text;
            }
          })
          .attr("class", "textStream")
          .attr("font-size", function(d,i){
            if(self.sizeScale){
              return   Math.round(self.sizeScale.d3ScaleLateral(d[self.sizeScale.dataCol.name])) * 0.1 ;   //since the bot is excluded from size,think about it can't explain
            }
            else{
              return self.size;
            }
          })
          .attr("fill",this.color)
          .attr("fill-opacity",(0.01*this.opacity))
          .attr("x", function(d) { 
              if(self.xPosScale){
                cx=Math.round(self.xPosScale.d3ScaleLateral(d[self.xPosScale.dataCol.name]));
                return cx;
              }
              else{
                return null;
                } })
          .attr("y",function(d) { 
            if(self.yPosScale){
              cy= Math.round(self.yPosScale.d3ScaleLateral(d[self.yPosScale.dataCol.name]));
              return -cy;
              }
              else{
                return null;
              } })
          .attr("transform",function(d) {
            if(self.xPosScale){
              cx=Math.round(self.xPosScale.d3ScaleLateral(d[self.xPosScale.dataCol.name])); //center of rotation
            }
            if(self.yPosScale){
              cy= Math.round(self.yPosScale.d3ScaleLateral(d[self.yPosScale.dataCol.name])); //center of rotation
            }
            
            return "rotate("+(-self.angle)+","+cx+","+cy+")";
          });
          //.attr("transform","rotate("+(-this.angle)+","+cx+","+cy+")");


    //tranform to X and Y   
    d3.select("#"+this.d3TextId)
        .attr("transform", " translate("+(project.getStageX(this.xPos)-this.originXShift)+","+(project.getStageY(this.yPos)-this.originYShift)+")");   //scale(1,-)     

  }



}

//open modal when double click
$(document).on('dblclick','.textGroupItem',function(e){

  $('#addTextModal').modal('show',$(this));
});

//delete text
$(document).on('click','.textDelBtn',function(e){

  var textId=$(this).attr('data-text-id');
  var textTobeDeleted='text'+textId;
  project.text[textTobeDeleted].deleteText();

});


///////////////////modal events
//add text modle open
$('#addTextModal').on('show.bs.modal', function(e) {
  var textId = $(e.relatedTarget).data('textid');
  var textName='text'+textId;
  var textObj=project.text[textName];
  var defaultName="Text"+project.textNum;

  $("#textId").val(textId);                     //to be referenced in update clicked


  
  console.log('text', textObj);
    //update
    if(textObj){
        //populate the textbox
      $(e.currentTarget).find('#textName').val(textObj.name);
      $(e.currentTarget).find('#textText').val(textObj.text);
      $(e.currentTarget).find('#textSize').val(textObj.size);
      $(e.currentTarget).find('#textText').val(textObj.text);
      $(e.currentTarget).find('#textX').val(textObj.xPos);
      $(e.currentTarget).find('#textY').val(textObj.yPos);
      $(e.currentTarget).find('#textColor').val(textObj.color);
      $(e.currentTarget).find('#textAngle').val(textObj.angle);
      $(e.currentTarget).find('#textOpacityInput').val(textObj.opacity);
      $(e.currentTarget).find('#textOpacityOutput').val(textObj.opacity);
      $(e.currentTarget).find('#textDataset').val(textObj.id_dataset);
      $("#updateTextBtn").html("Update");
      $("#textHeading").html("Update Text");
    }
    else{
      $(e.currentTarget).find('#textName').val(defaultName);
      $(e.currentTarget).find('#textText').val("");
      $(e.currentTarget).find('#textSize').val(18);
      $(e.currentTarget).find('#textText').val("");
      $(e.currentTarget).find('#textX').val(600);
      $(e.currentTarget).find('#textY').val(200);
      $(e.currentTarget).find('#textColor').val("#000000");
      $(e.currentTarget).find('#textAngle').val(0);

      $(e.currentTarget).find('#textDataset').val("");
      $("#updateTextBtn").html("Add");
      $("#textHeading").html("Add text");
    }

    
   

    //a data select is changed
  $(document).on('change', '#textDataset', function() {
    var selectedDataset=$(this);

    //console.log('textDs',selectedDataset.val(), selectedDataset);

    //if no dataset selected toggle
    if(selectedDataset.val()===""){
      
      $(".textSelect").hide();
    }
    else{
      ajaxCall('get','dataset/scales/'+selectedDataset.val(),'','json',getScalesCallback);
      $(".textSelect").show();

    }

    function getScalesCallback(data){
      //remove previous
      $('.textScaleSelect').html('');
      $('.textLinearScaleSelect').html('');



      //add new
      for(var i=0;i<data.length;i++){
        //add header once
        if(i===0){
          //Linear + ordinal scales
          $('.textScaleSelect').append($('<option>', { 
                value:'',
                text : 'No scale' 
            }));
          //only Linear scales
          $('.textLinearScaleSelect').append($('<option>', { 
                value:'',
                text : 'No scale' 
          }));
        }
          //Linear + ordinal scales
          $('.textScaleSelect').append($('<option>', { 
              value: data[i].idScales,
              text : data[i].scale_name 
          }));

          //Linear  scales
          if(data[i].type==="Linear"){ //only add Linear scales
            $('.textLinearScaleSelect').append($('<option>', { 
              value: data[i].idScales,
              text : data[i].scale_name 
            }));
          }


      }
      //update clicked,assign respective values
      if(textObj){
        $(e.currentTarget).find('#textSizeScale').val(textObj.sizeScaleId);
        $(e.currentTarget).find('#textTextScale').val(textObj.textScaleId);
        $(e.currentTarget).find('#textXScale').val(textObj.xPosScaleId);
        $(e.currentTarget).find('#textYScale').val(textObj.yPosScaleId);
          
      }


       
        
    }
  });
  $(e.currentTarget).find('#textDataset').trigger("change"); 
});


///////////////submit events
//update text
$("#textForm").submit(function(e){

  e.preventDefault();
  e.stopImmediatePropagation();

  var textId=$("#textId").val();
  var dataset=($("#textDataset option:selected").text());
  var datasetName=dataset.split(".");
  datasetName=datasetName[0];
  var action=$("#updateTextBtn").text();

  var textData={
    name:$("#textName").val(),
    size:$("#textSize").val(),
    sizeScale:$("#textSizeScale").val(),
    text:$("#textText").val(),
    textScale:$("#textTextScale").val(),
    xPos:$("#textX").val(),
    xPosScale:$("#textXScale").val(),
    yPos:$("#textY").val(),
    yPosScale:$("#textYScale").val(),
    angle:$("#textAngle").val(),
    color:$("#textColor").val(),
    opacity:$("#textOpacityInput").val(),
    pid:project.pid,
    dataset:$("#textDataset").val()
  };
  console.log(textData);

  if(action==="Add"){
    ajaxCall('post','text/create',textData,'json',addTextCallback);
  }
  else if(action==="Update"){
    ajaxCall('post','text/update/'+textId,textData,'json',updateTextCallback);
  }
  else{
    console.error("Invalid action");
  }
  
  

  $("#addTextModal").modal('hide');//close modal dialog
  
});

function addTextCallback(data){
  var text=new Text(data.name,data.text,data.size,data.angle,data.xPos,data.yPos,data.color,data.opacity,data.id,data.dataset,data.sizeScale,data.textScale,data.xPosScale,data.yPosScale);
  text.addText();
}

function updateTextCallback(data){
  var updatedText=new Text(data.name,data.text,data.size,data.angle,data.xPos,data.yPos,data.color,data.opacity,data.id,data.dataset,data.sizeScale,data.textScale,data.xPosScale,data.yPosScale);
  updatedText.updateText();
}




