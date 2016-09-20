<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests;
use Request;

use App\User;

class usersController extends Controller
{
    //
    function index(){

    	$users=User::all();

    	return view('user.manageUsers',compact('users'));
    }

    /*
    *Open create page
    */
    function create(){
    	
    	return view('user.create');
    }

    /*
    *Open edit page
    */
     function edit($id){
        $user=User::findOrFail($id);
        return view('user.edit',compact('user'));
    }
     /*
    *update user
    */
     function update($id){
        $input=Request::all();

        $user=User::findOrFail($id);
        $input['email']=$user->email; //since email field is disabled in the edit user form 

        // create the validation rules ------------------------
        $rules = array(
            'firstname'             => 'required',                        // just a normal required validation
            'lastname'         => 'required',                        // just a normal required validation
            'email'            => 'required|email',                  // required and must be unique in the users table
            'password'         => 'required',
            
        );
        $validationResponse=$this->validateForm($input,$rules);

        if($validationResponse=="passed"){
            $user->firstname=$input['firstname'];
            $user->lastname=$input['lastname'];
            $user->password=\Hash::make($input['password']);
            $user->userlevel=isset($input['isAdmin'])?1:0;
            $user->save();

            return redirect('users');
        }
        else{
            return Redirect::to('users/edit/'.$user->iduser)
                ->withErrors($validationResponse)->withInput();
        }
    }
    
    
    /*
    *Store a user in database
    */
	function store(){
        $input=Request::all();

        // create the validation rules ------------------------
        $rules = array(
            'firstname'        => 'required',                        // just a normal required validation
            'lastname'         => 'required',                        // just a normal required validation
            'email'            => 'required|email|unique:users',     // required and must be unique in the users table
            'password'         => 'required',
            
        );
        $validationResponse=$this->validateForm($input,$rules);

        if($validationResponse=="passed"){
         

            $user=new \App\User;   
            $user->firstname=$input['firstname'];
            $user->email=$input['email'];
            $user->lastname=$input['lastname'];
            $user->password=\Hash::make($input['password']);
            $user->userlevel=isset($input['isAdmin'])?1:0;
            $user->save();
            
            return redirect('users');
        }
        else{
            return Redirect::to('users/create')
                ->withErrors($validationResponse)->withInput();
        }
        

    }

    /*
    *Delete an user
    */
    function delete($id){
        \App\User::destroy($id);   

        return redirect('users'); 
    }

    /*
    *validate user form input
    */
    function validateForm($input,$rules){

       // do the validation ----------------------------------
        // validate against the inputs from our form
        $validator = Validator::make($input, $rules);

        // check if the validator failed -----------------------
        if ($validator->fails()) {
            
            // get the error messages from the validator
            $messages = $validator->messages();

            return $messages;
        } 
        else{
            return 'passed';
        }
    }

}
