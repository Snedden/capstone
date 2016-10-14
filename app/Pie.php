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
     * a Pie belongs to a entity
     *
     * @var array
     */
     public function baseEntity()
    {
        return $this->belongsTo('App\Entitie','idEntities');//belongsTo(model,foreignkey)
    }

   
}
