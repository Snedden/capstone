@extends('layouts.app')



<div class="container">
    <!-- <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>
                @if (Auth::user()->userlevel==1)
                    <h1>This is admin bar</h1>
                @endif
                <div class="panel-body">
                    You are logged in !
                </div>
            </div>
        </div>
    </div> -->

    
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
            @forelse ($projects as $project)
              <a href={{url('projects/'.$project->pid)}}  >{{ $project->name }}</a></br>
            @empty
              <p>No projects</p>
            @endforelse
            
          </div>
        </div>
      </div>
      </div>

      <div style="text-align:center" class="col-xs-6 col-md-4">Shared Projects</div>
      
    </div>

   
</div>

 

@section('content')
@endsection
