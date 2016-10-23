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
   		$rect->Offset_X=$rectData['xOffset'];
   		$rect->Y_pos=$rectData['yPos'];
   		$rect->Offset_Y=$rectData['yOffset'];
   		$rect->Height=$rectData['height'];
   		$rect->Width=$rectData['width'];

   		$rect->save();
   		$rectData['id']=$rect->idRectangle; //add the id of just inserted row
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
