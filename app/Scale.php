<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Scale extends Model
{
    //
    protected $primaryKey='idScales';
  
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'scale_nname','pid','col_Id','type','range_from','range_to','bandpadding'
      
    ];   

     /**
     * a scale belongs to a single project
     *
     * @var array
     */
    public function project()
    {
        return $this->belongsTo('App\Project','pid');//belongsTo(model,foreignkey)
    }

    /**
     * a scale has one associated column
     *
     * @var array
     */
     public function column()
    {
        return $this->hasOne('App\DataSetColumn','pid');//belongsTo(model,foreignkey)
    }

        /**
     * a scale has many axis
     *
     * @var array
     */
    public function axis()
    {
        return $this->hasMany('App\Axes','idScales', 'idScales');
    }
    
}
