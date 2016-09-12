<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\SharedProject;

class shareProjectsController extends Controller
{
    
    /*
    *Share project with  user
    */
    function createShareProject(){
      	$submitData = $_POST['data'];

      	
      	
   		
        $shareProject=new SharedProject;   
        $shareProject->iduser=$submitData[0]['userid'];
        $shareProject->pid=$submitData[0]['projectId'];
    
        $shareProject->save(); 
         
     

     
       
    }

     /*
    *unShare project with  user
    */
    function deleteShareProject(){

      	$submitData = $_POST['data'];
      	
      	$shareProject = SharedProject::where('iduser',$submitData[0]['userid'])->where('pid',$submitData[0]['projectId'])->delete();    
		
    }
}
