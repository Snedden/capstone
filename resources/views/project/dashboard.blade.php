@extends('layouts.app')

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



li {
  cursor:pointer;
}

.dataset li{
  display: none;
}



</style>
<h4 style="margin-top:2px;margin-bottom:2px">{{$project->name}}</h1>
<div style="background-color:#b3acac" >
  
  <button type="button" class="btn  menuBtn" data-toggle="modal" data-target="#myModal">Share project</button>
  <button type="button" class="btn  menuBtn" data-toggle="modal" data-target="#fileUploadModal" >Add Data</button>

</div>  


 

<div class="container" style="width:98%">

  <div>
           
         
  </div>
  <div class="row clearfix">
    <div class="span_4 column">
        <div class='funcGroup'>
          <h3>Data</h3>
           <ul>
            @forelse ($project->datasets as $dataset)
              <li class='dataset'>{{$dataset->name}} <a style="float:right;font-size:9px"href="#" class="btn btn-xs btn-primary" data-toggle="modal" data-target="#datasetModal" data-dataset-name="{{$dataset->name}}" data-project-id="{{$project->pid}}"  data-dataset-id="{{$dataset->iddata_sets}}">edit</a>
                <ul>
                  @forelse($dataset->columns as $col)
                    <li>{{$col->col_name}}</li>
                  @empty
                    <li>No columns found!</li>
                  @endforelse
                </ul>
              </li>
            @empty
              <span>No data</p>
            @endforelse 
          </ul>  
        </div>
         <div class='funcGroup'>
          scales
        </div>
    </div>
   
    <div id="stageDiv" class="span_7 column" style="height:500px">
       
    </div>
    <div class="span_4 column">
      <h4>Info</h4>
         <div class='funcGroup'>
          <span>Stage X :</span><span id="infoStageX">567</span><br/>
          <span>Stage Y :</span><span id="infoStageY">457</span>
        </div>
         <div class='funcGroup'>
          entity
        </div>
        <div class='funcGroup'>
          groups
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
          <form method="POST" action="{{url('dataset/create/'.$project->pid)}}" accept-charset="UTF-8" enctype="multipart/form-data" >
            <input type="hidden" name="_token" value="{{csrf_token()}}">  
            <input type="file" name="csv" value="" accept=".csv" />
            <input type="submit" value="Upload File">
          </form>
        
        </div>  
          
        <div class="modal-footer">
          <button type="button" id="closefileUpBtn" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      
      </div>
 
    </div>
  </div>
  <!-- file upload Modal End -->

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
  <!-- file upload Modal End -->

</div>

@endsection