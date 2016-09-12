<?php

namespace App\Http\Controllers;

use Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests;
use App\Http\Requests\projectCheck;
use Auth;
use App\Project;
use App\User;
use App\SharedProject;
use DB;



class projectsController extends Controller
{
    //

    /*
    *project dashboard
    */

    function index($pid){
    	$project=Project::findOrFail($pid);
    	$users=User::all();
        $sharedProjectsusers=SharedProject::where('pid',2)->get();
        $sharedProjectsusers = DB::select( DB::raw(" select s.iduser ,u.email from sharedProjects s inner join users u on u.iduser=s.iduser where s.pid=:projectId "), array(
                     'projectId' => $pid,
                    ));
        
       
        $nonSharedUsers = DB::select( DB::raw("SELECT iduser,email FROM users WHERE  NOT EXISTS (SELECT * FROM sharedProjects WHERE sharedProjects.iduser= users.iduser and sharedProjects.pid=:projectId)"), array(
                     'projectId' => $pid,
                    ));
       
    	return view('project.dashboard',compact('project','users','nonSharedUsers','sharedProjectsusers'));
    }

    /*
    *Create new project
    */
    function create(projectCheck $request){
    	$input=Request::all();
    
    	$project=new Project;   
        $project->name=$input['name'];
        $project->iduser=Auth::user()->iduser;
        
        $project->save();

        return redirect('projects/'.$project->pid); 
            
            
    }

    
}
