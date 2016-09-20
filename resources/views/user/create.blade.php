@extends('layouts.app')

@section('content')
	<h1>Create new user </h1>
	</hr>

	<form method="POST" action="{{url('users/add')}}" accept-charset="UTF-8" style="width:70%;margin:0 auto">
	
		@include('user.partials.userForm')

		<div id="createCancelButtons" style="margin:0 auto;display:table">
			<button type="submit"  class="btn btn-default form-control" style="width: 100px;margin:10px">Create</button>
  			<button type="button"   onClick="location.href = '{{ url('users') }}'" class="btn btn-default form-control" style="width: 100px;margin:10px">Cancel</button>
		</div>
	
	  
	</form>	
@endsection