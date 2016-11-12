<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Pie;

class pieController extends Controller
{
     /*
   create a pie
   */
   function create(){

   	//add validation here
   	//

	   	$pieData=$_POST['data'];
	    
		try{
	   		$pie=new Pie();
	   		$pie->piename=$pieData['name'];
	   		$pie->Opacity=$pieData['opacity'];
	   		$pie->pid=$pieData['pid'];
	   		$pie->X_pos=$pieData['xPos'];
	   		$pie->Y_pos=$pieData['yPos'];
	   		$pie->innerRadius=$pieData['innerRadius'];
	   		$pie->outerRadius=$pieData['outerRadius'];
	   		$pie->LabelCol=$pieData['labelCol'];
	   		$pie->valueCol=$pieData['valueCol'];
	   		$pie->labelRadius=$pieData['labelRadius'];
	   		$pie->iddata_sets=$pieData['dataset'];
	   		$pie->dataSetName=$pieData['datasetName'];
	   		

	   		$pie->save();
	   		$pieData['id']=$pie->idpie; //add the id of just inserted row
	   		return $pieData;


	   	}
	   	catch(exception $e){
	   		$feedback->message=$e->getMessage();
	        $feedback->type="error";
	        return $feedback;
	   	}


   	}
}
