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


    function create(){
    	
    	return view('user\create');
    }
    
    /*
    *Store a user in database
    */
	function store(){


        // create the validation rules ------------------------
        $rules = array(
            'name'             => 'required',                        // just a normal required validation
            'lastname'         => 'required',                        // just a normal required validation
            'email'            => 'required|email|unique:users',     // required and must be unique in the users table
            'password'         => 'required',
            
        );

        // do the validation ----------------------------------
        // validate against the inputs from our form
        $validator = Validator::make(Request::all(), $rules);

        // check if the validator failed -----------------------
        if ($validator->fails()) {

            // get the error messages from the validator
            $messages = $validator->messages();

            // redirect our user back to the form with the errors from the validator
            return Redirect::to('users/create')
                ->withErrors($messages)->withInput();

        } 
        else {

        $input=Request::all();
        
        //find if email already exist
        $user=User::where('email','like',$input['email']) -> first();
        if(!is_null($user)){
            return 'email id already exist';
        }

        $user=new \App\User;   
        $user->name=$input['name'];
        $user->email=$input['email'];
        $user->lastname=$input['lastname'];
        $user->password=\Hash::make($input['password']);

        $user->save();
        
        return redirect('users');

        }



    }

    function delete($id){
        \App\User::destroy($id);   

        return redirect('users'); 
    }

}
