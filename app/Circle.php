<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Circle extends Model
{
    //
    protected $table = 'Circle';
    protected $primaryKey='idCircle';

    protected $fillable = [
        'cir_name','X_pos','Y_pos','radius','Opacity','text','idScale','idColorScale','idEntity'
      
    ]; 

     /**
     * a Circle belongs to a project
     *
     * @var array
     */
     public function project()
    {
        return $this->belongsTo('App\Project','pid');//belongsTo(model,foreignkey)
    }



}
