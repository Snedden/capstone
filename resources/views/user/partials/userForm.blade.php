
<input type="hidden" name="_token" value="{{csrf_token()}}">	
		
		<div class="form-group{{ $errors->has('firstname') ? ' has-error' : '' }}">
		    <label for="firstname">Firstname:</label>
		    <input type="text" name="firstname" class="form-control" id="firstname" pattern=".{2,}" title="2 characters minimum" value="{{isset($user)?$user->firstname:old('firstname') }}" required>
	  	</div>
	  	<div class="form-group{{ $errors->has('lastname') ? ' has-error' : '' }}">
		    <label for="lastname">Lastname:</label>
		    <input type="text" name="lastname" class="form-control" id="lastname" pattern=".{2,}" title="2 characters minimum" value="{{isset($user)?$user->lastname:old('lastname') }}" required>
	  	</div>

		<div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
		    <label for="email">Email address:</label>
		    <input type="email" name="email" class="form-control" id="email"  value="{{isset($user)?$user->email:old('email') }}" title="email id not valid" required>
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
		<div class="form-group">
		    <label for="pwd"><input type="checkbox" id="isAdmin" value="" name="isAdmin"  >   Admin </label>

		</div>
		