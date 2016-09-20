@extends('layouts.app')

@section('content')
	<h1>Edit user </h1>
	</hr>

	<form method="POST" action="{{url('users/edit/'.$user->iduser)}}" accept-charset="UTF-8" style="width:70%;margin:0 auto">
	
		@include('user.partials.userForm')
	  	
	  	<div id="createCancelButtons" style="margin:0 auto;display:table">
			<button type="submit"  class="btn btn-default form-control" style="width: 100px;margin:10px">Edit</button>
  			<button type="button"   onClick="location.href = '{{ url('users') }}'" class="btn btn-default form-control" style="width: 100px;margin:10px">Cancel</button>
		</div>
	
	</form>	
		<!--to check/uncheck admin checkbox-->
		<script>
			(function(){
			
				var isAdmin="{{$user->userlevel}}"=="1"?true:false;
				document.getElementById("isAdmin").checked = isAdmin;
				document.getElementById("email").disabled = true;
			})();
		</script>	
@endsection

