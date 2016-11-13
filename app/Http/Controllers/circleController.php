<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Circle;

use App\Http\Requests;

class circleController extends Controller
{
   /*
   create a circle
   */
   function create(){

   	//add validation here
   	//

	   	$circleData=$_POST['data'];
	   
		try{
	   		$circle=new Circle();
	   		$circle->cir_name=$circleData['name'];
	   		$circle->Opacity=$circleData['opacity'];
	   		$circle->color=$circleData['color'];
	   		$circle->pid=$circleData['pid'];
	   		$circle->X_pos=$circleData['xPos'];
	   		$circle->Y_pos=$circleData['yPos'];
	   		$circle->radius=$circleData['radius'];
	   		

	   		$circle->save();
	   		$circleData['id']=$circle->idCircle; //add the id of just inserted row
	   		return $circleData;


	   	}
	   	catch(exception $e){
	   		$feedback->message=$e->getMessage();
	        $feedback->type="error";
	        return $feedback;
	   	}


   	}

   	   	/*
   	*update and circleangle with id $id
   	*/
   	public function update($id){
   		$circleData=$_POST['data'];
         
   		$circle=Circle::findOrFail($id);
   		$circle->cir_name=$circleData['name'];
   		$circle->Opacity=$circleData['opacity'];
   		$circle->Color=$circleData['color'];
   		$circle->pid=$circleData['pid'];
  		   $circle->X_pos=$circleData['xPos'];
   		$circle->Y_pos=$circleData['yPos'];
   		$circle->radius=$circleData['radius'];
   		if(strlen($circleData['dataset'])==0){
   			$circle->iddata_sets=null;
   		}
   		else{
   			$circle->iddata_sets=$circleData['dataset'];
   		}

   		if(!$circleData['xPosScale']==""){
   			$circle->XScale=$circleData['xPosScale'];	
   		}
   		else{
   			$circle->XScale=null;
   		}
   		if(!$circleData['yPosScale']==""){
   			$circle->YScale=$circleData['yPosScale'];	
   		}
   		else{
   			$circle->YScale=null;
   		}

   		if(!$circleData['radiusScale']==""){
   			$circle->radiusScale=$circleData['radiusScale'];	
   		}
   		else{
   			$circle->radiusScale=$circleData['radiusScale'];
   		}

   		$circle->save();
   		$circleData['id']=$circle->idCircle; //add the id of just updated row
   		return $circleData;
   	}

   	/**
	*delete the circle from storage
	*/
	public function delete(){
		$circleId=$_POST['data'];
	    Circle::destroy($circleId);
	    return 'deleted';
	}
}
