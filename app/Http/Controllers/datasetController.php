<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests;
use App\DataSet;
use App\DataSetColumn;
use Auth;
use Exception;
use finfo;
use DB;

class datasetController extends Controller
{
    //
    /*
    //Create a dataset
    */
    function create($pid){

    	$tmpName = $_FILES['file']['tmp_name'];
    	$file = file($tmpName);
    	$fileName=($_FILES['file']['name']);
    	$fileExt=explode(".",$fileName)[1];

    	//doing it here as temp file is deleted after upload
    	if($fileExt=='json'){
    		$fileString = file_get_contents($tmpName);
			$fileAsArray = json_decode($fileString, true);
    	}
    	else if($fileExt=='csv'){
    		$fileAsArray = array_map('str_getcsv', $file);
    	}

		
		
		
		
		//uploading a file
		try {
		    
		    // Undefined | Multiple Files | $_FILES Corruption Attack
		    // If this request falls under any of them, treat it invalid.
		/*	if(!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'][0])){
   				throw new Exception('File missing');
			}*/

		    if (
		        !isset($_FILES['file']['error']) ||
		        is_array($_FILES['file']['error'])
		    ) {
		        throw new Exception('Invalid parameters.');
		    }

		    // Check $_FILES['file']['error'] value.
		    switch ($_FILES['file']['error']) {
		        case UPLOAD_ERR_OK:
		            break;
		        case UPLOAD_ERR_NO_FILE:
		            throw new Exception('No file sent.');
		        case UPLOAD_ERR_INI_SIZE:
		        case UPLOAD_ERR_FORM_SIZE:
		            throw new Exception('Exceeded filesize limit.');
		        default:
		            throw new Exception('Unknown errors.');
		    }

		    // You should also check filesize here. 
		    if ($_FILES['file']['size'] > 1000000) {
		        throw new Exception('Exceeded filesize limit.');
		    }

		    // DO NOT TRUST $_FILES['file']['mime'] VALUE !!
		    // Check MIME Type by yourself.
		    $finfo = new finfo(FILEINFO_MIME_TYPE);
		    //dd($finfo->file($_FILES['file']['tmp_name']));
		    //var_dump($finfo->file($_FILES['file']['tmp_name']));
		    if (false === $ext = array_search(
		        $finfo->file($_FILES['file']['tmp_name']),
		        array(
		            'csv' => 'text/csv',
		            'json' => 'application/json',
		            'csv' =>'text/plain',
		            
		        ),
		        true
		    )) {
		        throw new Exception('Invalid file format.');
		    }

		    // You should name it uniquely.
		    // DO NOT USE $_FILES['file']['name'] WITHOUT ANY VALIDATION !!
		    // On this example, obtain safe unique name from its binary data.
		    $path=sha1_file($_FILES['file']['tmp_name']);

			

		    //dev config
		    if (!move_uploaded_file(
		        $_FILES['file']['tmp_name'],
		        sprintf(base_path().'/public/devStorage/%s.%s',
		            $path,
		            $fileExt
		        )
		    )) {
		        throw new Exception('Failed to move uploaded file.');
		    }

	    	//dd($fileAsArray);
			$rows=count($fileAsArray);
	        //everything fine,file is uploaded succesfully
		    //save dataset
		    $dataset=new DataSet;   
	        $dataset->name=$_FILES['file']['name'];
	        $dataset->iduser=Auth::user()->iduser;
	        $dataset->pid=$pid;
	        $dataset->path=$path;
	        $dataset->type=$fileExt;
	        $dataset->rows=$rows;
	        $dataset->cols=count($fileAsArray[0]);
		    
		    $dataset->save();

		    //parsing different types of files 
		    if($fileExt=='csv'){

		    	for($i=0;$i<count($fileAsArray[0]);$i++ ){
		        	$datasetCol=new DataSetColumn;
					$datasetCol->col_name=$fileAsArray[0][$i];  //first row is assume to be the header row
					if(is_numeric($fileAsArray[1][$i])){        //second row is taken as value and its type is assumed for entire column
						$datasetCol->col_type='Number';	
					}
					else{
						$datasetCol->col_type='String';
					}
					$datasetCol->iddata_sets=$dataset->iddata_sets;
					
					$datasetCol->save();
		        }

		      	
	        }
	        else if($fileExt=='json'){
	        	
	        	//check if json is in valid format

	        	$validJson=$this->isValidFormat($fileAsArray);
	       		if(!$validJson){
	       			throw new Exception('Please have valid json format, i.e. array of objects.');

	       		}

	       		foreach ($fileAsArray as $key => $L1val) { //level one of json
	       			$counter=0;
					foreach ($L1val as $key => $L2val) { //level two of json //we know $L1val is an array
						

						$datasetCol=new DataSetColumn;
						$datasetCol->col_name=$key;                 //key if col heading
						if(is_numeric($L2val)){        
							$datasetCol->col_type='Number';	
						}
						else{
							$datasetCol->col_type='String';
						}
						$datasetCol->iddata_sets=$dataset->iddata_sets;
						
						$datasetCol->save();

						$counter++;
						}
					if($counter>0){
						break; //do this only once as we only need meta data not the data
					}
				}

					
	        }
	        else{
	        	throw new Exception('Invalid file type');
	        }

	    	return json_encode($dataset);
		    
	         

		} catch (Exception $e) {

		    $message='Error:'.$e->getMessage();
		    return $message;

		}


	}

	function isValidFormat($jsonObj){
		
		if(is_array($jsonObj)){
			
			foreach ($jsonObj as $key => $L1val) { //level one of json
				if(is_array($L1val)){

					foreach ($L1val as $key => $L2val) { //level two of json
						if(is_array($L2val)){
							return false;  //level three should not be a array but a string
						}
					}
				}
				else{
					return false; //level two should be array too
				}
        	}

        	return true; //file is parsed and valid
		}
		else{
			return false;  //level one should be array 
		}
	}
	/*
	*Delete a dataset
	*/
	function delete(){

        $postData=$_POST['data'];
       
		$iddata_sets=$postData['iddata_sets'];
		$pid=$postData['pid'];
		

		DataSet::destroy($iddata_sets);

		return redirect('projects/'.$pid); 
	}

	/*
	*Get data columns of the dataset  with id @param :id
	*/
	function getCols($id){

		$columns=DataSet::find($id)->columns()->get();
		
		return json_encode($columns);
	}

	/*
	*Get axis of the columns of the dataset  with id @param :id
	*/
	function getScales($id){

		$axis=DB::select("select idScales,scale_name,type from scales where col_Id in (select col_Id from data_sets_columns where iddata_sets=? )",[$id]);
		
		return json_encode($axis);
	}
}
