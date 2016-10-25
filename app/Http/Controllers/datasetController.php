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

    	$tmpName = $_FILES['csv']['tmp_name'];
		$csvAsArray = array_map('str_getcsv', file($tmpName));
		//dd($csvAsArray);
		$rows=count($csvAsArray);

		
		
		//uploading a file
		try {
		    
		    // Undefined | Multiple Files | $_FILES Corruption Attack
		    // If this request falls under any of them, treat it invalid.
		    if (
		        !isset($_FILES['csv']['error']) ||
		        is_array($_FILES['csv']['error'])
		    ) {
		        throw new Exception('Invalid parameters.');
		    }

		    // Check $_FILES['csv']['error'] value.
		    switch ($_FILES['csv']['error']) {
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
		    if ($_FILES['csv']['size'] > 1000000) {
		        throw new Exception('Exceeded filesize limit.');
		    }

		    // DO NOT TRUST $_FILES['csv']['mime'] VALUE !!
		    // Check MIME Type by yourself.
		    $finfo = new finfo(FILEINFO_MIME_TYPE);
		    var_dump($finfo->file($_FILES['csv']['tmp_name']));
		    if (false === $ext = array_search(
		        $finfo->file($_FILES['csv']['tmp_name']),
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
		    // DO NOT USE $_FILES['csv']['name'] WITHOUT ANY VALIDATION !!
		    // On this example, obtain safe unique name from its binary data.
		    $path=sha1_file($_FILES['csv']['tmp_name']);

		    //server config
		  /*  if (!move_uploaded_file(
		        $_FILES['csv']['tmp_name'],
		        sprintf(base_path().'/storage/%s.%s',
		            $path,
		            $ext
		        )
		    )) {
		        throw new Exception('Failed to move uploaded file.');
		    }*/

		    //dev config
		    if (!move_uploaded_file(
		        $_FILES['csv']['tmp_name'],
		        sprintf(base_path().'/public/devStorage/%s.%s',
		            $path,
		            $ext
		        )
		    )) {
		        throw new Exception('Failed to move uploaded file.');
		    }


		    //everything fine,file is uploaded succesfully
		    //save dataset
		    $dataset=new DataSet;   
	        $dataset->name=$_FILES['csv']['name'];
	        $dataset->iduser=Auth::user()->iduser;
	        $dataset->pid=$pid;
	        $dataset->path=$path;
	        $dataset->type=$ext;
	        $dataset->rows=$rows;
	        $dataset->cols=count($csvAsArray[0]);
	        $dataset->save();

	        for($i=0;$i<count($csvAsArray[0]);$i++ ){  
	        	$datasetCol=new DataSetColumn;
				$datasetCol->col_name=$csvAsArray[0][$i];  //first row is assume to be the header row
				if(is_numeric($csvAsArray[1][$i])){        //second row is taken as value and its type is assumed for entire column
					$datasetCol->col_type='Number';	
				}
				else{
					$datasetCol->col_type='String';
				}
				$datasetCol->iddata_sets=$dataset->iddata_sets;
				$datasetCol->save();
	        }

	      
	        return redirect('projects/'.$pid); 

		} catch (Exception $e) {

		    echo 'Error:'.$e->getMessage();

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

		$axis=DB::select("select idScales,scale_name from scales where col_Id in (select col_Id from data_sets_columns where iddata_sets=? )",[$id]);
		
		return json_encode($axis);
	}
}
