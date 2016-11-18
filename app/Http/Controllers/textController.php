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
}
