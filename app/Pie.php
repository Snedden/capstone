<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pie extends Model
{
    //
    protected $table = 'pie';
    protected $primaryKey='idpie';

     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'piename','X_pos','Y_pos','innerRadius','outerRadius','LabelCol','valueCol','Color','idEntity'
      
    ]; 

     /**
     * a Pie belongs to a project
     *
     * @var array
     */
     public function project()
    {
        return $this->belongsTo('App\Project','pid');//belongsTo(model,foreignkey)
    }


   
}
