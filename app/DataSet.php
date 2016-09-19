<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DataSet extends Model
{
    //
     protected $table = 'data_sets';
     protected $primaryKey='iddata_sets';

     protected $fillable=['iduser','path','rows'];
    
      /**
     * a Dataset belongs to a single user
     *
     * @var array
     */
     public function user()
    {
        return $this->belongsTo('App\User');
    }
      

     /**
     * a Dataset has many columns
     *
     * @var array
     */
     public function columns()
    {
        return $this->hasMany('App\DataSetColumn','iddata_sets','iddata_sets');//hasMany('model',foreingnkey,localkey)
    }  

        
}

