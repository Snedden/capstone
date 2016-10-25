<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Axes extends Model
{
    //
    protected $table = 'axes';
    protected $primaryKey='idaxes';

        protected $fillable = [
        'name','orient','X_pos','Y_pos','Stroke','Thickness','idScales'
      
    ]; 

     /**
     * a Axes belongs to a scale
     *
     * @var array
     */
     public function scale()
    {
        return $this->belongsTo('App\scale','idScales');//belongsTo(model,foreignkey)
    }


}
