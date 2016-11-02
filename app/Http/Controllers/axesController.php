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
            if(!$this->validateAxes($axesData)){
                $feedback['message']="There was an validation error in the server";
                $feedback['type']="error";
                
                return $feedback;
            }
       

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
            $feedback['scaleId']=$axes->idScales;
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

    /**
    *update the axes in storage
    */
    public function update(){
        $axesData=$_POST['data'];
        try{
            //validate
            if(!$this->validateAxes($axesData)){
                $feedback['message']="There was an validation error in the server";
                $feedback['type']="error";
                
                return $feedback;
            }
       

            $axes=Axes::findOrFail($axesData['id']);
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
            $feedback['scaleId']=$axes->idScales;
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

   public function validateAxes($axesData){

        if(!ctype_digit($axesData['xPos'])){
            return false;
        }
        else if(!ctype_digit($axesData['yPos'])){
            return false;
        }
        else if(!ctype_digit($axesData['ticks'])){
            return false;
        }
        else if(!ctype_digit($axesData['scale'])){
            return false;
        }
        return true;
            
    }

 
}
