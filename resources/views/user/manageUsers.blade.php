@extends('layouts.app')

@section('content')
<div class="container">
  <h2>Users</h2>
  <p>Users List</p>
  <table class="table table-hover">
    <thead>
      <tr>
        <th>Firstname</th>
        <th>Lastname</th>
        <th>Email</th>
        <th>Admin</th>
      </tr>
    </thead>
    <tbody>
      @foreach($users as $user)
       <tr>
            <td>{{$user->firstname}}</td>
            <td>{{$user->lastname}}</td>
            <td>{{$user->email}}</td>
            <td>{{$user->userlevel=="1"?"yes":"no"}}</td>
            <td><button type="button" class="btn btn-default navbar-btn" data-animal-type={{$user->iduser}} onClick="window.location.href='/users/edit/{{$user->iduser}}'">Edit</button></td>
            <td><button type="button" class="btn btn-default navbar-btn" data-animal-type={{$user->iduser}} onClick="ConfirmDelete({{$user->iduser}})">Delete</button></td>
        </tr>
      @endforeach
    </tbody>
  </table>
  <button type="button" class="btn btn-default"   onClick="location.href = '{{ url('users/create') }}'">Create New User</button>
</div>

<script>
  function ConfirmDelete(id)
{
  var x = confirm("Are you sure you want to delete?");
  if (x)
  {
    location.href = "/users/delete/"+id;
  }
  else{
    
  }
    
}

</script>

@endsection