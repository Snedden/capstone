<?php

namespace App\Http\Controllers;

use Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests;
use App\Http\Requests\projectCheck;
use Auth;



class projectsController extends Controller
{
    //

    /*
    *Create new project
    */
    function create(projectCheck $request){
    	$input=Request::all();
    
    	$project=new \App\Project;   
        $project->name=$input['name'];
        $project->iduser=Auth::user()->iduser;
        
        $project->save();

        return redirect('home'); 
            
            
    }
}
