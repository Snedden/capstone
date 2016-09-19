<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\DataSetColumn;

class datasetColumns extends Controller
{
    //
    function updateCols(){
    	
    	foreach ($_POST['data'] as $col){
    		$dataSetColumn=DataSetColumn::find($col['col_id']);
    		$dataSetColumn->col_name=$col['col_name'];
    		$dataSetColumn->col_type=$col['col_type'];
    		$dataSetColumn->save();
    		
    	}
    }
}
