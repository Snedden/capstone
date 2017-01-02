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
use App\Scale;
use Carbon\Carbon ;
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
        $sharedProjectsusers=SharedProject::where('pid',$pid)->get();
        $sharedProjectsusers = DB::select( DB::raw("SELECT s.iduser ,u.email from sharedprojects s inner join users u on u.iduser=s.iduser where s.pid=:projectId and s.iduser<>:currentuser"), array(
                     'projectId' => $pid,
                     'currentuser'=>Auth::user()->iduser,
                    ));
        
       
        $nonSharedUsers = DB::select( DB::raw("SELECT iduser,email FROM users  WHERE  NOT EXISTS (SELECT * FROM sharedprojects WHERE sharedprojects.iduser= users.iduser and sharedprojects.pid=:projectId) AND  users.iduser<>:currentuser"), array(
                     'projectId' => $pid,
                     'currentuser'=>Auth::user()->iduser,
                    ));
       
    	return view('project.dashboard',compact('project','users','nonSharedUsers','sharedProjectsusers'));
    }

    /*
    *Create new project
    */
    function create(projectCheck $request){
    	$input=Request::all();
        //save in project
    	$project=new Project;   
        $project->name=$input['name'];
        $project->iduser=Auth::user()->iduser;
        
        $project->save();

        //save in shared project(shared with oneself)
        $shareProject=new SharedProject;   
        $shareProject->iduser=Auth::user()->iduser;
        $shareProject->pid=$project->pid;
    
        $shareProject->save(); 

        return redirect('projects/'.$project->pid); 
            
            
    }

    function updateProjectBy($pid){
        $project=Project::findOrFail($pid);
        
        $project->updatedby=Auth::user()->iduser;
        $project->updated_at=Carbon::now()->toDateTimeString();
        $project->save();
        return 'updated';
    }

    function isShared($pid){
        $sharedByCount=SharedProject::where('pid', $pid)->count();
        if($sharedByCount>1){
            return "true";
        }

        return "false";
    }

     /*
    *Check if this shared project is edited by more than one person more or less at the same time 
    */
    function checkForEditsByOthers($pid){
        $project=Project::findOrFail($pid);

        $updatedAtUnixTime=strtotime($project->updated_at);
        $editInfo=new \stdClass();
        $editInfo->secondsSinceLastEdit=(time()-$updatedAtUnixTime); //currenttime - lastupdatetime
        $editInfo->editedById=$project->updatedby;
        $editInfo->editedByName=User::findOrFail($project->updatedby)->firstname;
        $editInfo->currentUser=Auth::user()->iduser;
        return json_encode($editInfo);
        
    }
    
}
