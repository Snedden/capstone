<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Chart extends Model
{
    //
    protected $primary_key='idcharts';

     protected $fillable = [
        'iduser','path','pid'
      
    ]; 

      /**
     * a chart belongs to a single user
     *
     * @var array
     */
     public function user()
    {
        return $this->belongsTo('App\User');
    }

}

    
