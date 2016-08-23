<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Entitie extends Model
{
    //
    protected $primary_key='idEntities';

    protected $fillable = [
        'entity_name','entity_type','pid'
      
    ]; 

     /**
     * a Entitie belongs to a single project
     *
     * @var array
     */
     public function project()
    {
        return $this->belongsTo('App\Project','pid');//belongsTo(model,foreignkey)
    }

     /**
     * a Project has many Entities
     *
     * @var array
     */
     public function entities()
    {
        return $this->hasMany('App\Entitie','idEntities','pid');//hasMany('model',foreingnkey,localkey)
    }  


   
}
