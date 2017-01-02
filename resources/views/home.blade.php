@extends('layouts.app')
<script>

  function init(){//function in global scope
/*    var newProjectGotItClicked=window.sessionStorage.getItem("newProjectGotIt"); //'Got it' was clicked in this session
    
    //show helper if got it was not clicked
    if(!newProjectGotItClicked){
      $('#newProjectHelperModal').modal('show');  
    }
    
    //new project Got it clicked
    $("#newProjectGotItBtn").click(function(){
        var newProjectGotIt=true;
        window.sessionStorage.setItem("newProjectGotIt", newProjectGotIt); 
    });*/

    
    //add new project helper
    var newProjecthelper=new Helpers('newProjectGotIt',"newProjectHelperModal","newProjectGotItBtn");
  }
</script>


@section('content')
<div class="container">


    
    <form method="POST" action="{{url('projects/add')}}" accept-charset="UTF-8" style="width:70%;margin:0 auto">
      <input type="hidden" name="_token" value="{{csrf_token()}}"> 
 
      <div class="form-group{{ $errors->has('name') ? ' has-error' : '' }}">
          <input style="display:inline-block;width:65%" type="text" placeholder="project name" name="name" class="form-control" id="name" pattern=".{2,}" title="2 characters minimum" value="" required>
          <button type="submit"  class="btn btn-default form-control" style="width: 100px;">New Project</button>
           @if ($errors->has('name'))
                <span class="help-block">
                    <strong>{{ $errors->first('name') }}</strong>
                </span>
      @endif
      </div>
     </form> 

    <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
    <div class="row">
   

    <div class="panel-group col-xs-6 col-md-4">
      <div class="panel panel-default">
        <div class="panel-heading" style="text-align:center">My projects</div>
        <div class="panel-body">
          <div class="list-group">
            @forelse (Auth::user()->projects as $project)
              <a href={{url('projects/'.$project->pid)}}  >{{ $project->name }}</a></br>
            @empty
              <p>No projects</p>
            @endforelse
            
          </div>
        </div>
      </div>
    </div>

    <div class="panel-group col-xs-6 col-md-4">
      <div class="panel panel-default">
        <div class="panel-heading" style="text-align:center">Shared projects</div>
        <div class="panel-body">
          <div class="list-group">
            @forelse (Auth::user()->sharedProjects as $project)
              @if ($project->iduser != Auth::user()->iduser)
                <a href={{url('projects/'.$project->pid)}}  >{{ $project->name }}</a></br>
              @endif  
            @empty
              <p>No projects</p>
            @endforelse
            
          </div>
        </div>
      </div>
    </div>

   
</div>

<!-- helper  Modal -->
<div class="modal fade helper" id="newProjectHelperModal" role="dialog">
  <div class="modal-dialog" style="width: 900px">
  
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Create a New Project</h4>
      </div>
      <div class="modal-body">
        <img src="gifs/newProject.gif" alt="newProject helper">
      </div>  
        
      <div class="modal-footer">
        <label style="float:left;font-weight: 500"><input type="checkbox" class="doNotShowHelperCheckbox" value="">Don't show me helpers</label>
        <button type="button" id="newProjectGotItBtn" class="btn btn-default" data-dismiss="modal" >Got it</button>

      </div>
    </div>
  </div>
</div>

 


@endsection
