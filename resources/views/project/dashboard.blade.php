@extends('layouts.app')


<script>
    
    function init(){//function in global scope
      //reading server variables
      var svrProject=<?php echo json_encode($project); ?>;
      var svrDataSets=<?php echo json_encode($project->datasets); ?>;
      var svrScales=<?php echo json_encode($project->scales); ?>;
      var svrAxes=<?php echo json_encode($project->axes); ?>;
      var svrRects=<?php echo json_encode($project->rects) ?>;
      var svrCircles=<?php echo json_encode($project->circles) ?>;
      var svrPies=<?php echo json_encode($project->pies) ?>;
      var svrText=<?php echo json_encode($project->texts) ?>;
     
      project=new Project(svrProject.pid,svrProject.iduser,svrProject.name,svrDataSets,svrScales,svrAxes,svrRects,svrCircles,svrPies,svrText); //global object
      

    }
   
</script>       

@section('content')
<style>
.usersUL {
  list-style-type: none;
  padding: 0;
  margin: 0;
}



.usersUL li a {
 
  margin-top: -1px; /* Prevent double borders */
  
  
  text-decoration: none;
  font-size: 18px;
 
  display: block
}


.usersUL li a:hover:not(.header) {
  background-color: #eee;

}

.menuBtn{
 
    padding-top: 0;
    padding-bottom: 0;
    color: #fff;
    background-color: #89989c;

}
.navbar{
  margin-bottom: 0px;
}

<!--columns-->
*, *:before, *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.clearfix:after {
     visibility: hidden;
     display: block;
     font-size: 0;
     content: " ";
     clear: both;
     height: 0;
     }
.clearfix { display: inline-block; }
* html .clearfix { height: 1%; }
.clearfix { display: block; }

.row {
    margin: 0 auto;
    max-width: 1300px;
    width: 100%;
}

.stageAxis{
  display: none;
}

.column {
    float: left;
    
    background-color:grey;
    margin:1px;
    border-color: black;
    border-width: 1px;
    border-style: solid;
}

.span_4 {
    width: 15%;
}

.span_7 {
    width: 68%;
    background-color:white;
}

.funcGroup{
  background-color: silver;
  border-style: solid;
  border-color:;
}

ul {
  
  list-style-type: none;
   padding-left: 10px;
}

.listItem  {
  cursor:pointer;
  display:inline-block;
  width:100%;

}

.groupItem  {
  cursor:pointer;
  display:inline-block;
  width:75%;
}

.dataset li{
  display: none;
}

.stageAxis path {
  shape-rendering: crispEdges;
  stroke: #000FF0;
}


.stageAxis .minor line {
  stroke: #777;
  stroke-dasharray: 2,2;
}

.form-horizontal .control-label {
  padding-top: 0;
}

.rectSelect{
  display: none;
}

.selectPieDiv{
  display: none;
}



</style>
<h4 style="margin-top:2px;margin-bottom:2px">{{$project->name}}</h1>
<div style="background-color:#b3acac" >
  
  <button type="button" class="btn  menuBtn" data-toggle="modal" data-target="#myModal">Share project</button>
  <button type="button" class="btn  menuBtn" data-toggle="modal" data-target="#fileUploadModal" >Add Data</button>
  <button type="button" class="btn  menuBtn" data-toggle="modal" data-target="#embedModal" >Embed</button>
  <button type="button" class="btn  menuBtn" data-toggle="modal" data-target="#exportModal" >Export</button>
  <button type="button" class="btn  menuBtn" id="showHideRulerBtn" >Show Rulers</button>

</div>  


 

<div class="container" style="width:98%">
  <div id="wait" style="display:none;width:100%;height:100%;position:absolute;top:50%;left:50%;"><img src='../Loading_icon.gif' width="64" height="64" alt="loading..." /><br>Loading..
  </div>
  <div>
           
         
  </div>
  <div class="row clearfix">
    <div class="span_4 column">
        <div class='funcGroup'>
          <h5><b>Data</b></h5>
           <ul id="dataSetUL">

          </ul>  
        </div>
         <div class='funcGroup'>
          <h5><b>scales</b></h5>
          <ul id="scaleUl">
      
          </ul>  
        </div>
    </div>
   
    <div id="stageDiv" class="span_7 column" style="height:500px">
       
    </div>

    <div class="span_4 column">
      <!--Info-->
      <div class='funcGroup' style="height: 200px">
        <h5><b>Info</b></h5>
        <div>
          <span>Stage X :</span><span id="infoStageX">567</span>
        </div>
        <div>
          <span>Stage Y :</span><span id="infoStageY">457</span>
        </div>
        <div class="entityInfo" style="display:none" id="entityNameInfoDiv" >
          <span>Entity Name :</span><span id="entityNameInfo"></span>
        </div>
        <div class="entityInfo" style="display:none" id="entityTypeInfoDiv" >
          <span>Entity Type :</span><span id="entityTypeInfo"></span>
        </div>
        
      </div>
      <!--Entity Add-->
      <div class='funcGroup'>
         <h5><b>Add</b></h5>
         <button data-toggle="modal" data-target="#addAxesModal">Axes</button>
         <button id="addRectBtn">Rect</button>
         <button id="addCircleBtn">Circle</button>
         <button data-toggle="modal" data-target="#addPieModal">Pie</button>
         <button data-toggle="modal" data-target="#addTextModal">Text</button>
      </div>

      <!--Entity group-->
      <div class='funcGroup' style="height:200px;overflow:auto">
        <h5><b>Groups</b></h5>
        <ul id="groupsUl">
        </ul>
      </div>
    </div>
    
    
</div>



  
  <!-- share userModal -->
  <div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Users</h4>
        </div>
        <div class="modal-body">
        	<div id="userList" style="width:45%;margin:10px;display:inline-block;vertical-align: top;">
        		<input type="text" id="myInput" onkeyup="filterNames()" placeholder="Search for names.." title="Type in a name">

				    <ul class="usersUL">
              @forelse ($nonSharedUsers as $nonSharedUser)
                <li title="Add user"><a data-project-id={{$project->pid}} data-user-id={{$nonSharedUser->iduser}} href="#">{{ $nonSharedUser->email }}</a></li>
              @empty

              @endforelse
            </ul>
       
        	</div>
        	<div id="sharedUsers" style="width:45%;margin:10px;display:inline-block;vertical-align: top;">
        		<span>Shared Users</span>
  				  <ul class="usersUL" >
  			  		@forelse ($sharedProjectsusers as $sharedProjectsuser)
                <li title="Add user"><a data-project-id={{$project->pid}} data-user-id={{$sharedProjectsuser->iduser}} href="#">{{ $sharedProjectsuser->email }}</a></li>
              @empty
                  
              @endforelse
            </ul>
				  </div>
        </div>	
          
        <div class="modal-footer">
          <button type="button" id="closeShareBtn" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <!-- share userModal End-->

  <!-- file upload Modal -->
  <div class="modal fade" id="fileUploadModal" role="dialog">
    <div class="modal-dialog">
      
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Upload file</h4>
        </div>
        <div class="modal-body">
          <form method="POST" action="" id="datasetUploadForm" accept-charset="UTF-8" enctype="multipart/form-data" >

            <input type="hidden" name="_token" value="{{csrf_token()}}">  
            <input type="file" name="csv" id="csv" value="" accept=".csv,.json" />
            <input type="submit" value="Upload File">
            <br/><span style="color:green" id="ajaxFeedback">Json and CSV file format excepted,<a id="showHideJsonStrucBtn"href="#">Show</a> excepted json structure <span/> 
            <pre id="jsonDemoStruc" style="display: none">
              [
                {
                  "Column1": "Row1 Column1 data",
                  "Column2": "Row1 Column2 data",
                  .
                  .
                  "ColumnN": "Row1 columnN data"
                },
                {
                  "Column1": "Row2 Column1 data",
                  "Column2": "Row2 Column1 data",
                  .
                  .
                  "ColumnN": "Row2 columnN data"
                },
                .
                .
                {
                  "Column1": "RowN Column1 data",
                  "Column2": "RowN Column1 data",
                  .
                  .
                  "ColumnN": "RowN columnN data"
                }
              ] 
            </pre>
            
            <br/><span style="color:red" id="ajaxFeedback"><span>   

          </form>
        
        </div>  
          
        <div class="modal-footer">
          <button type="button" id="closefileUpBtn" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      
      </div>
 
    </div>
  </div>
  <!-- file upload Modal End -->

  <!-- embed Modal -->
  <div class="modal fade" id="embedModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content" >
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Embed</h4>
        </div>
        <div class="modal-body" style="height: 200px; overflow: scroll">
         <span type="text" id="embedableOp" >asdasdas ada  dasd ads</span>
        
        </div>  
          
        <div class="modal-footer">
          <button type="button" id="closefileUpBtn" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>

      
      </div>
 
    </div>
  </div>
  <!-- embed Modal End -->

  <!-- export Modal -->
  <div class="modal fade" id="exportModal" role="dialog" >
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content" style="width:900px" >
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Export</h4>
        </div>
        <div class="modal-body">
          <canvas id="canvas1" width="1000px" height="600px"></canvas> 
        </div>  
        <div class="modal-footer">
          <button type="button" id="closefileUpBtn" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      
      </div>
 
    </div>
  </div>
  <!-- export Modal End -->

  <!-- dataset Modal -->
  <div class="modal fade" id="datasetModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" id='datasetName'>Dataset</h4>
        </div>
        <div class="modal-body">
          <h5>Columns</h5>
          <ul id='dataSetColsList'>
            
            <!-- Populated in ajax call back: datasetColumnCallback(data) -->
           
          </ul>
        </div>  
          
        <div class="modal-footer">
          <button type="button" id="updateDatasetBtn" class="btn btn-default"  data-dismiss="modal">Update</button>
          <button type="button" id="deleteDatasetBtn" class="btn btn-default"  data-dismiss="modal">Delete</button>
        </div>
      
      </div>
 
    </div>
  </div>
  <!-- dataset Modal End -->

  <!-- addScaleModal Modal -->
  <div class="modal fade" id="addScaleModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" id='datasetName'>Add Scale</h4>
        </div>
        <form  id="scaleForm" method="POST" action="" accept-charset="UTF-8" class="form-horizontal">
          <div class="modal-body">
            <input type="hidden" name="_token" value="{{csrf_token()}}"> 
            <input type="hidden"  id="dataColId" >
            <input type="hidden"  id="scaleId" >  

            <div class="form-group">
              <label class="control-label col-sm-2" for="dataScaleName">Name:</label>
              <div class="col-sm-10">
                <input title="Name of the scale"  class="form-control" required name="dataScaleName" disabled="true" id="dataScaleName"  />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="dataColtype">Type:</label>
              <div class="col-sm-10">
                <input title="Linear for Numeric data ,Ordinal for non-numeric data" class="form-control" name="dataColtype" required value="Linear" disabled="true" id="dataColtype"  />
              </div>
            </div>

             <div class="form-group linearScaleInput">
              <label class="control-label col-sm-2" for="dataColDomainFrom">Domain From:</label>
              <div class="col-sm-10">
                <input title="data source to map from, lower limit"  class="form-control " name="dataColDomainFrom"  disabled="true" required id="dataColDomainFrom" value="12"  id="domain_from"  />
              </div>
            </div>

             <div class="form-group linearScaleInput">
              <label class="control-label col-sm-2" for="dataColDomainTo">Domain To:</label>
              <div class="col-sm-10">
                <input title="data source to map from, upper limit"  class="form-control " type="number" name="dataColDomainTo"  required disabled="true"  id="dataColDomainTo"  value=560  />
              </div>
            </div>

            <div class="form-group linearScaleInput">
              <label class="control-label col-sm-2" for="range_from">Range From:</label>
              <div class="col-sm-10"> 
                <input title="map to screen, lower limit"  class="form-control " id="range_from" name="range_from" disabled="true" value="0" min=0 max=600 required type="number"   placeholder="start range">
              </div>
            </div>

             <div class="form-group linearScaleInput">
              <label class="control-label col-sm-2" for="range_to">Range To:</label>
              <div class="col-sm-10">
                <input title="map to screen, upper limit" class="form-control " name="range_to" id="range_to" value="500" min=0 max=600 required type="number" onblur="validateRangeTo(this)" placeholder="end range">
              </div>
            </div>
            <div class="form-group ordinalScaleInput">
              <label class="control-label col-sm-2" for="domainOrdinal">Domain:</label>
              <div class="col-sm-10">
                <input title="data source to map from"  class="form-control "  disabled="true" required id="domainOrdinal" value="12"   />
              </div>
            </div>

            <div class="form-group ordinalScaleInput">
              <label class="control-label col-sm-2" for="scaleWidthOrdinal">Width:</label>
              <div class="col-sm-10">
                <input title="width for scale"  class="form-control" type="number" value="500" name="scaleWidthOrdinal"  min=1 required id="scaleWidthOrdinal" placeholder="scaleWidth"    />
              </div>
            </div>

            <div class="form-group ordinalScaleInput">
              <label class="control-label col-sm-2" for="scaleBandPaddingOrdinal">Band Padding:</label>
              <div class="col-xs-3">
                <input  title="padding between succesive entry in a scale" class="form-control col-xs-3 " value=10  type="range" oninput="setOutput(this,'scaleBandPaddingOrdinalOutput')" min=0 max=100 required id="scaleBandPaddingOrdinal" placeholder="scaleWidth"   />
              </div>  
              <div class="col-xs-3">
                <input type="text" class="form-control " id="scaleBandPaddingOrdinalOutput" disabled="true" value="">
              </div>
            </div>



          <span style="color:red" id="ajaxFeedback"><span> 
          </div>  
            
          <div class="modal-footer">
            <button type="submit" id="addScaleBtn" class="btn btn-default"  >Add</button>
            <button type="button"  class="btn btn-default"  data-dismiss="modal">Close</button>

          </div>
        </form>
      
      </div>
 
    </div>
  </div>
  <!-- addScaleModal Modal End -->

  <!-- Axes Modal -->
  <div class="modal fade" id="addAxesModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" id='datasetName'>Add Axes</h4>
        </div>
        <form  id="axesForm" method="POST" action="" accept-charset="UTF-8" class="form-horizontal">
          <input type="hidden"  id="axesId" />  
          <div class="modal-body">
           
            <input type="hidden" name="_token" value="{{csrf_token()}}"> 
            

            <div class="form-group">
              <label class="control-label col-sm-2" for="axesName" >Name:</label>
              <div class="col-sm-10">
                <input title="name of the axes"  class="form-control" required name="axesName" placeholder="Axes Name"  id="axesName"  />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="axesScale">Scale:</label>
              <div class="col-sm-10">
                <select title="Associated scale " name="axesScale" id="axesScale" required>
                  <option value="">select</option>
                <!--  populated in addscale prototype -->
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="axesOrient">Orient:</label>
              <div class="col-sm-10">
                <select title="Axes orient on the screen" name="axesOrient" id="axesOrient">
                <option value="Bottom" selected>Bottom</option>
                  <option value="Top">Top</option>
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="axesLabelAngle">Label Angle:</label>
              <div class="col-sm-2">
                <input title="Angle of the labels on the axes" class="form-control" type="number" value=45 min=-180 max=180  required name="axesLabelAngle" placeholder="" id="axesLabelAngle"  />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="axesLabelAnchor">Label Anchor:</label>
              <div class="col-sm-5">
                <select title="Anchor for the labels on the axes" name="axesLabelAnchor" id="axesLabelAnchor">
                  <option value="start">start</option>
                  <option value="middle">middle</option>
                  <option value="end">end</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="axesX">X:</label>
              <div class="col-sm-10">
                <input title="X  position of the axes"  class="form-control" type="number" value=100 required name="axesX" placeholder="X position" id="axesX"  />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="axesY" >Y:</label>
              <div class="col-sm-10">
                <input title="Y position of the axes"  class="form-control" type="number" value=50  required name="axesY" placeholder="Y position"  id="axesY"  />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="axesTicks">Ticks:</label>
              <div class="col-sm-10">
                <input title="Number of ticks on the axes"  class="form-control" required type="number" placeholder="number of ticks" min=1 max=30 name="axesTicks" value=10  id="axesTicks"  />
              </div>
            </div>

          </div>  
          <span style="color:red" id="ajaxFeedback"><span>   
          <div class="modal-footer">
            <button type="submit" id="addAxesBtn" class="btn btn-default"  >Add</button>
            <button type="button"  class="btn btn-default"  data-dismiss="modal">Close</button>
          </div>
        </form>
      </div>
 
    </div>
  </div>
  <!-- Axes Modal End -->

  <!-- Rect Modal    -->
  <div class="modal fade" id="addRectModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" id='rectHeading'>Add Rect</h4>
        </div>
        <form  id="rectForm" method="POST" action="" accept-charset="UTF-8" class="form-horizontal">
          <div class="modal-body">
           <input type="hidden" name="_token" value="{{csrf_token()}}"> 
            <input type="hidden"  id="rectId" >  

            <div class="form-group">
              <label class="control-label col-sm-2" for="rectName" >Name:</label>
              <div class="col-sm-10">
                <input title="Name of the rectangle" class="form-control" required name="rectName" placeholder="Rectangle Name"  id="rectName"  />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="rectDataset">Dataset:</label>
              <div class="col-sm-10">
                <select title="Associated Dataset" name="rectDataset" id="rectDataset">
                  <option value="">No dataset</option>
<!--                   @forelse ($project->datasets as $dataset)
                    <option value="{{$dataset->iddata_sets}}">{{$dataset->name}}</option>
                  @empty
                  @endforelse  -->  

                  
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label class="control-label col-sm-2" for="rectHeight">Height:</label>
              <div class="col-sm-2">
                <input title="Height of the rectangle" class="form-control" type="number"  required name="rectHeight" placeholder="" id="rectHeight"  />
              </div>
              <label class="control-label col-sm-3 rectSelect" for="rectHeightScale">Height Scale:</label>
               <div class="col-sm-3 rectSelect">
                <select name="rectHeightScale" title="Associated scale" class="rectScaleSelect rectLengths" data-assinputid="rectHeight" id="rectHeightScale" >
                   <!-- populated in rectagle.js getAxesCallback -->
                </select>
              </div>
            </div>

             <div class="form-group">
              <label class="control-label col-sm-2 " for="rectWidth">Width:</label>
              <div class="col-sm-2">
                <input title="Width of the rectangle" class="form-control" type="number"  required name="rectWidth" placeholder="" id="rectWidth"  />
              </div>
              <label class="control-label col-sm-3 rectSelect" for="rectWidthScale">Width Scale:</label>
               <div class="col-sm-3 rectSelect">
                <select title="Associated scale" name="rectWidthScale" class="rectScaleSelect rectLengths" data-assinputid="rectWidth" id="rectWidthScale" >
                   <!-- populated in rectagle.js getAxesCallback -->
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="rectX">X:</label>
              <div class="col-sm-2">
                <input title="X position of the rectangle" class="form-control" type="number"  required name="rectX" placeholder="" id="rectX"  />
              </div>
              <label class="control-label col-sm-3 rectSelect" for="rectXScale">X Scale:</label>
               <div class="col-sm-3 rectSelect">
                <select title="Associated scale" name="rectXScale" class="rectScaleSelect " id="rectXScale" data-assinputid="rectX" >
                   <!-- populated in rectagle.js getAxesCallback -->
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2 " for="rectY">Y:</label>
              <div class="col-sm-2">
                <input title="Y position of the rectangle" class="form-control" type="number"  required name="rectY" placeholder="" id="rectY"  />
              </div>
              <label class="control-label col-sm-3 rectSelect" for="rectYScale">Y Scale:</label>
               <div class="col-sm-3 rectSelect">
                <select title="Associated scale"  name="rectYScale" id="rectYScale" class="rectScaleSelect" data-assinputid="rectY" >
                   <!-- populated in rectagle.js getAxesCallback -->
                </select>
              </div>
            </div>



             <div class="form-group">
              <label class="control-label col-sm-2" for="rectColor">Color</label>
              <div class="col-sm-2">
                <input title="Color of the rectangle" class="form-control" required type="color" placeholder="Color"  name="rectColor"  id="rectColor"  />
              </div>
            </div>

            <div class="form-group ">
              <label class="control-label col-sm-2" for="rectOpacityOutput">Opacity:</label>
              <div class="col-xs-3">
                <input title="Opacity of the rectangle"  class="form-control col-xs-3 " value=100  type="range" oninput="setOutput(this,'rectOpacityOutput')" min=0 max=100 required id="rectOpacityInput" placeholder="Opacity"   />
              </div>  
              <div class="col-xs-3">
                <input type="text" class="form-control " id="rectOpacityOutput" disabled="true" value="1">
              </div>
            </div>



          </div>  
          <span style="color:red" id="ajaxFeedback"><span>   
          <div class="modal-footer">
            <button type="submit" id="updateRectBtn" class="btn btn-default"  >Update</button>
            <button type="button"  class="btn btn-default"  data-dismiss="modal">Close</button>
          </div>
        </form>
      </div>
 
    </div>
  </div>
  <!-- Rect Modal End -->

  <!-- Circle Modal    -->
  <div class="modal fade" id="addCircleModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" id='circleHeading'>Add Circle</h4>
        </div>
        <form  id="circleForm" method="POST" action="" accept-charset="UTF-8" class="form-horizontal">
          <div class="modal-body">
           
            <input type="hidden" name="_token" value="{{csrf_token()}}"> 
            <input type="hidden"  id="circleId" >  

            <div class="form-group">
              <label class="control-label col-sm-2" for="circleName" >Name:</label>
              <div class="col-sm-10">
                <input title="Name of the circle"  class="form-control" required name="circleName" placeholder="Circle Name"  id="circleName"  />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="circleDataset">Dataset:</label>
              <div class="col-sm-10">
                <select title="Associated dataset" name="circleDataset" id="circleDataset">
                  <option value="">No dataset</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label class="control-label col-sm-2" for="circleRadius">Radius:</label>
              <div class="col-sm-2">
                <input title="Radius of the circle" class="form-control" type="number"  required name="circleRadius" placeholder="" id="circleRadius"  />
              </div>
              <label class="control-label col-sm-3 circleSelect" for="circleRadiusScale">Radius Scale:</label>
               <div class="col-sm-3 circleSelect">
                <select title="Associated scale" name="circleRadiusScale" class="circleLinearScaleSelect circleLengths" data-assinputid="circleRadius" id="circleRadiusScale" >
                   <!-- populated in circle.js getAxesCallback -->
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="circleX">X:</label>
              <div class="col-sm-2">
                <input title="X position of the circle"  class="form-control" type="number"  required name="circleX" placeholder="" id="circleX"  />
              </div>
              <label class="control-label col-sm-3 circleSelect" for="circleXScale">X Scale:</label>
               <div class="col-sm-3 circleSelect">
                <select title="Associated scale" name="circleXScale" class="circleScaleSelect " id="circleXScale" data-assinputid="circleX" >
                   <!-- populated in circlee.js getAxesCallback -->
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2 " for="circleY">Y:</label>
              <div class="col-sm-2">
                <input title="Y position of the circle"  class="form-control" type="number"  required name="circleY" placeholder="" id="circleY"  />
              </div>
              <label class="control-label col-sm-3 circleSelect" for="circleYScale">Y Scale:</label>
               <div class="col-sm-3 circleSelect">
                <select title="Associated scale" name="circleYScale" id="circleYScale" class="circleScaleSelect" data-assinputid="circleY" >
                   <!-- populated in circle.js getAxesCallback -->
                </select>
              </div>
            </div>


             <div class="form-group">
              <label class="control-label col-sm-2" for="circleColor">Color</label>
              <div class="col-sm-2">
                <input title="Color of the rectangle"  class="form-control" required type="color" placeholder="Color"  name="circleColor"  id="circleColor"  />
              </div>
            </div>

            <div class="form-group ">
              <label class="control-label col-sm-2" for="circleOpacityOutput">Opacity:</label>
              <div class="col-xs-3">
                <input title="Opacity of the circle"  class="form-control col-xs-3 " value=100  type="range" oninput="setOutput(this,'circleOpacityOutput')" min=0 max=100 required id="circleOpacityInput" placeholder="Opacity"   />
              </div>  
              <div class="col-xs-3">
                <input type="text" class="form-control " id="circleOpacityOutput" disabled="true" value="1">
              </div>
            </div>
          </div>  

          <span style="color:red" id="ajaxFeedback"><span>   
          <div class="modal-footer">
            <button type="submit" id="updateCircleBtn" class="btn btn-default"  >Update</button>
            <button type="button"  class="btn btn-default"  data-dismiss="modal">Close</button>
          </div>
        </form>
      </div>
 
    </div>
  </div>
  <!-- Circle Modal End -->

    <!-- Pie Modal    -->
  <div class="modal fade" id="addPieModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" id='pieHeading'>Add Pie</h4>
        </div>
        <form  id="pieForm" method="POST" action="" accept-charset="UTF-8" class="form-horizontal">
          <div class="modal-body">
           
            <input type="hidden" name="_token" value="{{csrf_token()}}"> 
            <input type="hidden"  id="pieId" >  

            <div class="form-group">
              <label class="control-label col-sm-2" for="pieName" >Name:</label>
              <div class="col-sm-8">
                <input title="Name of the pie"  class="form-control" required name="pieName"  placeholder="Pie Name"  id="pieName"  />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="pieDataset">Dataset:</label>
              <div class="col-sm-10">
                <select name="pieDataset" id="pieDataset" required>
                  <option value="">No dataset</option>         
                </select>
              </div>
            </div>

            <div class="form-group selectPieDiv">
              <label class="control-label col-sm-2" for="pieLabels">Pie Labels:</label>
              <div class="col-sm-10">
                <select title="Linked dataset columns for pie labels" name="pieLabels" class="pieSelects" id="pieLabels" required>
                  <option value=""></option> 
                </select>
              </div>
            </div>
            <div class="form-group selectPieDiv" >
              <label class="control-label col-sm-2" for="pieValues">Pie values:</label>
              <div class="col-sm-10">
                <select title="Linked dataset columns for pie values" name="pieValues" id="pieValues" class="pieSelects" required>
                  <option value=""></option>  
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label class="control-label col-sm-2" for="pieInnerRadius">Inner Radius:</label>
              <div class="col-sm-4">
                <input title="Inner Radius of the pie" class="form-control" type="number" value=0 min=0 max=300  required name="pieInnerRadius" placeholder="" id="pieInnerRadius"  />
              </div>

            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="pieOuterRadius">Outer Radius:</label>
              <div class="col-sm-4">
                <input  class="form-control" type="number" min=0 max=320 required name="pieOuterRadius" value=120 id="pieOuterRadius"  />
              </div>

            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="pieLabelRadius">Label Radius:</label>
              <div class="col-sm-4">
                <input title="Radius for the pie labels" class="form-control" type="number" value=125 min=0 max=320  required name="pieLabelRadius" placeholder="" id="pieLabelRadius"  />
              </div>

            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="pieCornerRadius">Corner Radius:</label>
              <div class="col-sm-4">
                <input title="corner radius for each arc of the pie"  class="form-control" type="number" value=0 min=0 max=300  required name="pieCornerRadius" placeholder="" id="pieCornerRadius"  />
              </div>

            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="pieX">X:</label>
              <div class="col-sm-2">
                <input title="X position of the pie" class="form-control" type="number" value=300  required name="pieX" placeholder="" id="pieX"  />
              </div>

            </div>

            <div class="form-group">
              <label class="control-label col-sm-2 " for="pieY">Y:</label>
              <div class="col-sm-2">
                <input title="Y position of the pie" class="form-control" type="number" value="200"  required name="pieY" placeholder="" id="pieY"  />
              </div>
            </div>

            <div class="form-group ">
              <label class="control-label col-sm-2" for="pieOpacityOutput">Opacity:</label>
              <div class="col-xs-3">
                <input title="Opacity of the pie" class="form-control col-xs-3 " value=100  type="range" oninput="setOutput(this,'pieOpacityOutput')" min=0 max=100 required id="pieOpacityInput" placeholder="Opacity"   />
              </div>  
              <div class="col-xs-3">
                <input type="text" class="form-control " id="pieOpacityOutput" disabled="true" value="1">
              </div>
            </div>

            <div class="form-group ">
              <label class="control-label col-sm-2" for="piePaddingOutput">Padding:</label>
              <div class="col-xs-3">
                <input title="Padding between each arc of the pie"   class="form-control col-xs-3 " value=0  type="range" oninput="setOutput(this,'piePaddingOutput')" min=0 max=100 required id="piePaddingInput" placeholder="padding angle"   />
              </div>  
              <div class="col-xs-3">
                <input type="text" class="form-control " id="piePaddingOutput" disabled="true" value="0">
              </div>
            </div>
          </div>  

          <span style="color:red" id="ajaxFeedback"><span>   
          <div class="modal-footer">
            <button type="submit" id="updatePieBtn" class="btn btn-default"  >Add</button>
            <button type="button"  class="btn btn-default"  data-dismiss="modal">Close</button>
          </div>
        </form>
      </div>
 
    </div>
  </div>
  <!-- Pie Modal End -->

  <!-- Text Modal    -->
  <div class="modal fade" id="addTextModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" id='textHeading'>Add Text</h4>
        </div>
        <form  id="textForm" method="POST" action="" accept-charset="UTF-8" class="form-horizontal">
          <div class="modal-body">
           
            <input type="hidden" name="_token" value="{{csrf_token()}}"> 
            <input type="hidden"  id="textId" >  

            <div class="form-group">
              <label class="control-label col-sm-2" for="textName" >Name:</label>
              <div class="col-sm-10">
                <input title="Name of the text"  class="form-control" required name="textName" placeholder="Textangle Name"  id="textName"  />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2" for="textDataset">Dataset:</label>
              <div class="col-sm-10">
                <select title="Associated dataset" name="textDataset" id="textDataset">
                  <option value="">No dataset</option>                 
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label class="control-label col-sm-2" for="textHeight">Text:</label>
              <div class="col-sm-4">
                <input title="Actual text of the Text entity" class="form-control" value="Sample Text"  required name="textText" placeholder="Enter Text" id="textText"  />
              </div>
              <label class="control-label col-sm-2 textSelect" for="textTextScale">Text Scale:</label>
               <div class="col-sm-3 textSelect">
                <select title="Associated Scale" name="textTextScale" class="textScaleSelect textLengths" data-assinputid="textText" id="textTextScale" >
                   <!-- populated in text.js getAxesCallback -->
                </select>
              </div>
            </div>


            <div class="form-group">
              <label class="control-label col-sm-2" for="textHeight">Size:</label>
              <div class="col-sm-2">
                <input  class="form-control" type="number" value=18 required name="textSize" placeholder="" id="textSize"  />
              </div>
              <label class="control-label col-sm-4 textSelect" for="textSizeScale">Size Scale:</label>
               <div class="col-sm-3 textSelect">
                <select title="Associated Scale" name="textSizeScale" class="textLinearScaleSelect textLengths" data-assinputid="textSize" id="textSizeScale" >
                   <!-- populated in text.js getAxesCallback -->
                </select>
              </div>
            </div>



            <div class="form-group">
              <label class="control-label col-sm-2" for="textX">X:</label>
              <div class="col-sm-2">
                <input title="X position of the text" class="form-control" type="number" value=300 required name="textX" placeholder="" id="textX"  />
              </div>
              <label class="control-label col-sm-4 textSelect" for="textXScale">X Scale:</label>
               <div class="col-sm-3 textSelect">
                <select title="Associated Scale" name="textXScale" class="textScaleSelect " id="textXScale" data-assinputid="textX" >
                   <!-- populated in textagle.js getAxesCallback -->
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-sm-2 " for="textY">Y:</label>
              <div class="col-sm-2">
                <input title="Y position of the text"  class="form-control" type="number" value=200 required name="textY" placeholder="" id="textY"  />
              </div>
              <label class="control-label col-sm-4 textSelect" for="textYScale">Y Scale:</label>
               <div class="col-sm-3 textSelect">
                <select title="Associated Scale" name="textYScale" id="textYScale" class="textScaleSelect" data-assinputid="textY" >
                   <!-- populated in textagle.js getAxesCallback -->
                </select>
              </div>
            </div>





             <div class="form-group">
              <label class="control-label col-sm-2" for="textColor">Color</label>
              <div class="col-sm-2">
                <input title="Color of the text"  class="form-control" required type="color" placeholder="Color"  name="textColor"  id="textColor"  />
              </div>
            </div>

            <div class="form-group">
              <label title="Angle of the text" class="control-label col-sm-2" for="textAngle">Angle</label>
              <div class="col-sm-2">
                <input  class="form-control" required type="number" min=-360 max=360 value=0  name="textColor"  id="textAngle"  />
              </div>
            </div>



            <div class="form-group ">
              <label class="control-label col-sm-2" for="textOpacityOutput">Opacity:</label>
              <div class="col-xs-3">
                <input title="Opacity of the text" class="form-control col-xs-3 " value=100  type="range" oninput="setOutput(this,'textOpacityOutput')" min=0 max=100 required id="textOpacityInput" placeholder="Opacity"   />
              </div>  
              <div class="col-xs-3">
                <input type="text" class="form-control " id="textOpacityOutput" disabled="true" value="1">
              </div>
            </div>



          </div>  
          <span style="color:red" id="ajaxFeedback"><span>   
          <div class="modal-footer">
            <button type="submit" id="updateTextBtn" class="btn btn-default"  >Add</button>
            <button type="button"  class="btn btn-default"  data-dismiss="modal">Close</button>
          </div>
        </form>
      </div>
 
    </div>
  </div>
  <!-- Text Modal End -->
</div>

@endsection