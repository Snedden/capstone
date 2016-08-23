<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rectangle extends Model
{
    //
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'rect_name','X_pos','Y_pos','Height','Width','Offset_X','Offset_Y','Opacity','Color','idScale','idEntities','idColorScale'
      
    ]; 

     /**
     * a Rectangle belongs to a entity
     *
     * @var array
     */
     public function baseEntity()
    {
        return $this->belongsTo('App\Entitie','idEntities');//belongsTo(model,foreignkey)
    }

 
    protected $table = 'Rectangle';
    protected $primary_key='idRectangle';
}
