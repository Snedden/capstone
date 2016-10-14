<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Axes;

class axesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $axesData=$_POST['data'];
        try{
            //validate
            if(!ctype_digit($axesData['xPos'])){
                $feedback['message']="X pos should be a number";
                $feedback['type']="error";
                
                return $feedback;
            }
            else if(!ctype_digit($axesData['yPos'])){
                $feedback['message']="Y pos should be a number";
                $feedback['type']="error";
                
                return $feedback;
            }
            else if(!ctype_digit($axesData['ticks'])){
                $feedback['message']="ticks should be a number";
                $feedback['type']="error";
                
                return $feedback;
            }
            else if(!ctype_digit($axesData['scale'])){
                $feedback['message']="invalid scale";
                $feedback['type']="error";
                
                return $feedback;
            }
            //validated

            $axes=new Axes();
            $axes->name=$axesData['name'];
            $axes->idScales=$axesData['scale'];
            $axes->orient=$axesData['orient'];
            $axes->X_pos=$axesData['xPos'];
            $axes->Y_pos=$axesData['yPos'];
            $axes->ticks=$axesData['ticks'];
            $axes->pid=$axesData['pid'];

            $axes->save();

            //return saved axes to front end
            $feedback['id']=$axes->idaxes;
            $feedback['name']=$axes->name;
            $feedback['scale']=$axes->idScales;
            $feedback['orient']=$axes->orient;
            $feedback['xPos']=$axes->X_pos;
            $feedback['yPos']=$axes->Y_pos;
            $feedback['ticks']=$axes->ticks;
            $feedback['message']='Axes saved';


            return $feedback;


        }
        catch(Exception $e){
            $feedback->message=$e->getMessage();
            $feedback->type="error";
            return $feedback;
        }

    }

    /**
    *delete the axes from storage
    */
    public function delete(){
        $axesId=$_POST['data'];
        Axes::destroy($axesId);
        return 'deleted';
    }

 
}
