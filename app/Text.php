<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Text extends Model
{
    //
    protected $table = 'text';
    protected $primaryKey='idtext';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'label','name','X_pos','Y_pos','size','font','angle','opacity', 'idEntity'
      
    ];

     /**
     * a Text belongs to a entity
     *
     * @var array
     */
     public function baseEntity()
    {
        return $this->belongsTo('App\Entitie','idEntities');//belongsTo(model,foreignkey)
    }
}
