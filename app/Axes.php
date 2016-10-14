<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Axes extends Model
{
    //
    protected $table = 'Axes';
    protected $primaryKey='idaxes';

        protected $fillable = [
        'name','orient','X_pos','Y_pos','Stroke','Thickness','idEntities'
      
    ]; 

     /**
     * a Axes belongs to a entity
     *
     * @var array
     */
     public function baseEntity()
    {
        return $this->belongsTo('App\Entitie','idEntities');//belongsTo(model,foreignkey)
    }


}
