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


</style>
<h4 style="margin-top:2px;margin-bottom:2px">{{$project->name}}</h1>
<div style="background-color:#b3acac" >
  
  <button type="button" class="btn  menuBtn" data-toggle="modal" data-target="#myModal">Share project</button>

</div>  


 

<div class="container">

  <!-- Trigger the modal with a button -->
  
  <!-- Modal -->
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

       
        	</div>
        	<div id="sharedUsers" style="width:45%;margin:10px;display:inline-block;vertical-align: top;">
        		<span>Shared Users</span>
				  <ul class="usersUL" >
			  		 @forelse ($sharedProjectsusers as $sharedProjectsuser)
            <li title="Add user"><a data-project-id={{$project->pid}} data-user-id={{$sharedProjectsuser->iduser}} href="#">{{ $sharedProjectsuser->email }}</a></li>
            @empty
                
            @endforelse
        </ul>
				</ul>
        	</div>
        </div>	
          
        <div class="modal-footer">
          <button type="button" id="closeShareBtn" class="btn btn-default" data-dismiss="modal">Close</button>
         
      </div>
      
    </div>
  </div>
  
</div>

@endsection