<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DataSetColumn extends Model
{
    //
    protected $table = 'data_sets_columns';
    protected $primary_key='col_Id';

    protected $fillable = [
        'col_name','col_type','iddata_sets'
      
    ]; 

     /**
     * a DatasetColumn belongs to a dataset
     *
     * @var array
     */
     public function dataset()
    {
        return $this->belongsTo('App\DataSet','iddata_sets'); //belongsTo(model,foreignKey)
    }

     /**
     * a DatasetColumn belongs to a dataset
     *
     * @var array
     */
     public function scale()
    {
        return $this->belongsTo('App\Scale','idScales'); //belongsTo(model,foreignKey)
    }
         
}
