<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Scale;

use App\Http\Requests;

class scalesController extends Controller
{
    /*
    *make a scale
    */
    function create(){
    	try{
	    	$scaleData=$_POST['data'];
	    	
	    	//validate
			if($scaleData['type']=="Linear"){
	    		if(!ctype_digit($scaleData['rangeFrom'])){
	    		$feedback['message']="Range Form should be a number";
	    		$feedback['type']="error";
	    		$feedback['on']="range_from";
	    		return $feedback;
		    	}
		    	else if(!ctype_digit($scaleData['rangeTo'])){
		    		$feedback['message']="Range To should be a number";
		    		$feedback['type']="error";
		    		$feedback['on']="range_to";
		    		return $feedback;
		    	}
		    	$rangeFrom=(int)$scaleData['rangeFrom'];
		    	$rangeTo=(int)$scaleData['rangeTo'];

		    	if($rangeFrom>$rangeTo){
		    		$feedback['message']="rangeFrom should be less then rangeTo";
		    		$feedback['type']="error";
		    		$feedback['on']="range_to";
		    		return $feedback;

		    	}
	    	}
	    	else if($scaleData['type']=="Ordinal"){
	    		if(!ctype_digit($scaleData['width'])){
	    			$feedback['message']="Width should be a number";
	    			$feedback['type']="error";
	    			return $feedback;
	    		}
	    		if(!is_numeric($scaleData['padding'])){
	    			$feedback['message']="Padding should be a number";
	    			$feedback['type']="error";
	    			return $feedback;
	    		}
	    	}
	    	else{
	    		throw new Exception('Scale type invalid');
	    	}
	    	//validate end

	    	//add to database
	    	$scale=new Scale();
	    	$scale->scale_name=$scaleData['name'];
	    	$scale->pid=$scaleData['pid'];
	    	$scale->col_Id=$scaleData['dataColId'];
	    	$scale->type=$scaleData['type'];

	    	if($scaleData['type']=="Linear"){
	    		$scale->range_from=$scaleData['rangeFrom'];
	    		$scale->range_to=$scaleData['rangeTo'];
	    	}
	    	else if($scaleData['type']=="Ordinal"){
	    		$scale->width=$scaleData['width'];
	    		$scale->bandpadding=$scaleData['padding'];
	    	}
	    	else{
	    		throw new Exception('Scale type invalid');
	    	}

	    	$scale->save();
	    	$feedback['message']='scale saved';
    		$feedback['id']=$scale->idScales;
    		$feedback['name']=$scale->scale_name;
    		$feedback['pid']=$scale->pid;
	    	$feedback['dataColId']=$scale->col_Id;
	    	$feedback['type']=$scale->type;
	    	$feedback['rangeFrom']=$scale->range_from;
	    	$feedback['rangeTo']=$scale->range_to;
	    	$feedback['width']=$scale->width;
	    	$feedback['padding']=$scale->bandpadding;
	    	return $feedback;
	    	
	    	
    	}
    	catch(Exception $e) {
    		$feedback['message']=$e->getMessage();
    		$feedback['type']="error";
	    	return $feedback;
    	}
    
    }
    
    /*
    *delete a scale
    */
    function delete(){
    	$scaleId=$_POST['data'];
    	Scale::destroy($scaleId);
    	return 'deleted';
    }

}
