<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Rectangle;

class rectController extends Controller
{
   /*
   create and rectangel
   */
   function create(){

   	//add validation here
   	//

	   	$rectData=$_POST['data'];
	   

	   	try{
	   		$rect=new Rectangle();
	   		$rect->rect_name=$rectData['name'];
	   		$rect->Opacity=$rectData['opacity'];
	   		$rect->color=$rectData['color'];
	   		$rect->pid=$rectData['pid'];
	   		$rect->X_pos=$rectData['xPos'];
	   		$rect->Y_pos=$rectData['yPos'];
	   		$rect->Height=$rectData['height'];
	   		$rect->Width=$rectData['width'];

	   		$rect->save();
	   		$rectData['id']=$rect->idRectangle; //add the id of just inserted row
	   		return $rectData;


	   	}
	   	catch(exception $e){
	   		$feedback->message=$e->getMessage();
	        $feedback->type="error";
	        return $feedback;
	   	}


   	}

   	/*
   	*update and rectangle with id $id
   	*/
   	public function update($id){
   		$rectData=$_POST['data'];
         
   		$rect=Rectangle::findOrFail($id);
   		$rect->rect_name=$rectData['name'];
   		$rect->Opacity=$rectData['opacity'];
   		$rect->color=$rectData['color'];
   		$rect->pid=$rectData['pid'];
   	   $rect->X_pos=$rectData['xPos'];
   		$rect->Y_pos=$rectData['yPos'];
         $rect->width=$rectData['width'];
         $rect->height=$rectData['height'];
   		if(strlen($rectData['dataset'])==0){
   			$rect->iddata_sets=null;
   		}
   		else{
   			$rect->iddata_sets=$rectData['dataset'];
   		}
   		
   		
   		//check if corresponding scales are selected
   		if($rectData['widthScale']!=""){
   								
   			$rect->widthScale=$rectData['widthScale'];
   		}
   		else{
   			
   			$rect->widthScale=null;
   		}

   		if($rectData['heightScale']!=""){
   		
   			$rect->heightScale=$rectData['heightScale'];
   		}
   		else{
   		
   			$rect->heightScale=null;
   		}
   		if($rectData['xPosScale']==""){
   			$rect->XScale=null;	
   		}
   		else{
   			$rect->XScale=$rectData['xPosScale'];	
   		}
		
		   if($rectData['yPosScale']==""){
   			$rect->YScale=null;	
   		}
   		else{
   			$rect->YScale=$rectData['yPosScale'];	
   		}
   		
   			
   		

   		$rect->save();
   		$rectData['id']=$rect->idRectangle; //add the id of just updated row
   		return $rectData;
   	}

	/**
	*delete the rect from storage
	*/
	public function delete(){

	    $rectId=$_POST['data'];
	    Rectangle::destroy($rectId);
	    return 'deleted';
	}
   		
}
