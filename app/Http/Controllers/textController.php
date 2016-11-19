<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Text;

class textController extends Controller
{
     /*
   create and textangel
   */
   function create(){

   	//add validation here
   	//

	   	$textData=$_POST['data'];
	   

	   	try{
	   		$text=new Text();
	   		$text->name=$textData['name'];
	   		$text->Opacity=$textData['opacity'];
	   		$text->color=$textData['color'];
	   		$text->pid=$textData['pid'];
	   		$text->X_pos=$textData['xPos'];
	   		$text->Y_pos=$textData['yPos'];
	   		$text->label=$textData['text'];
	   		$text->size=$textData['size'];
	   		$text->angle=$textData['angle'];
	   		if(strlen($textData['dataset'])==0){
	   			$text->iddata_sets=null;
	   		}
	   		else{
	   			$text->iddata_sets=$textData['dataset'];
	   		}


	   		//check if corresponding scales are selected
	   		if($textData['textScale']!=""){
	   			$text->label=null;					
	   			$text->textScale=$textData['textScale'];
	   		}
	 

	   		if($textData['sizeScale']!=""){
	   			$text->size=null;
	   			$text->sizeScale=$textData['sizeScale'];
	   		}
	  
	   		if($textData['xPosScale']==""){
	   			$text->XScale=null;	
	   		}
	   		else{
	   			$text->XScale=$textData['xPosScale'];	
	   		}
			
			if($textData['yPosScale']==""){
	   			$text->YScale=null;	
	   		}
	   		else{
	   			$text->YScale=$textData['yPosScale'];	
	   		}
	   		$text->save();
	   		$textData['id']=$text->idtext; //add the id of just inserted row
	   		return $textData;


	   	}
	   	catch(exception $e){
	   		$feedback->message=$e->getMessage();
	        $feedback->type="error";
	        return $feedback;
	   	}


   	}

   	/*
   	*update and text with id $id
   	*/
   	public function update($id){
   		$textData=$_POST['data'];
        $text=Text::findOrFail($id); 
   		$text->name=$textData['name'];
   		$text->Opacity=$textData['opacity'];
   		$text->color=$textData['color'];
   		$text->pid=$textData['pid'];
   		$text->X_pos=$textData['xPos'];
   		$text->Y_pos=$textData['yPos'];
   		$text->label=$textData['text'];
   		$text->size=$textData['size'];
   		$text->angle=$textData['angle'];
   		if(strlen($textData['dataset'])==0){
   			$text->iddata_sets=null;
   		}
   		else{
   			$text->iddata_sets=$textData['dataset'];
   		}
   		
   		
   		//check if corresponding scales are selected
   		if($textData['textScale']!=""){
   			$text->label=null;					
   			$text->textScale=$textData['textScale'];
   		}
 

   		if($textData['sizeScale']!=""){
   			$text->size=null;
   			$text->sizeScale=$textData['sizeScale'];
   		}
  
   		if($textData['xPosScale']==""){
   			$text->XScale=null;	
   		}
   		else{
   			$text->XScale=$textData['xPosScale'];	
   		}
		
		if($textData['yPosScale']==""){
   			$text->YScale=null;	
   		}
   		else{
   			$text->YScale=$textData['yPosScale'];	
   		}
   		
   			
   		

   		$text->save();
   		$textData['id']=$text->idtext; //add the id of just updated row
   		return $textData;
   	}

   		/**
	*delete the text from storage
	*/
	public function delete(){

	    $textId=$_POST['data'];
	    Text::destroy($textId);
	    return 'deleted';
	}

}
