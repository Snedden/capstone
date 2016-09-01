@extends('layouts.app')

@section('content')
	<h1>Create new user </h1>
	</hr>

	<form method="POST" action="http://localhost:8888/users/add" accept-charset="UTF-8" style="width:70%;margin:0 auto">
	
	<input type="hidden" name="_token" value="{{csrf_token()}}">	
		<div class="form-group{{ $errors->has('name') ? ' has-error' : '' }}">
		    <label for="name">Firstname:</label>
		    <input type="text" name="name" class="form-control" id="name" pattern=".{2,}" title="2 characters minimum" value="{{ old('name') }}" required>
	  	</div>
	  	<div class="form-group{{ $errors->has('lastname') ? ' has-error' : '' }}">
		    <label for="lastname">Lastname:</label>
		    <input type="text" name="lastname" class="form-control" id="lastname" pattern=".{2,}" title="2 characters minimum" value="{{ old('lastname') }}" required>
	  	</div>

		<div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
		    <label for="email">Email address:</label>
		    <input type="email" name="email" class="form-control" id="email"  value="{{ old('email') }}" title="email id not valid" required>
	  		 @if ($errors->has('email'))
                <span class="help-block">
                    <strong>{{ $errors->first('email') }}</strong>
                </span>
			@endif
	  	</div>
		<div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
		    <label for="pwd">Password:</label>
		    <input type="password" name="password" class="form-control" id="password" required pattern=".{6,}" title="minimum 6 characters">
		</div>
		<div id="createCancelButtons" style="margin:0 auto;display:table">
			<button type="submit"  class="btn btn-default form-control" style="width: 100px;margin:10px">Create</button>
  			<button type="button"   onClick="location.href = '{{ url('users') }}'" class="btn btn-default form-control" style="width: 100px;margin:10px">Cancel</button>
		</div>	
	  
	</form>	
@endsection