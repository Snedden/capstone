<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    //
    protected $primaryKey = 'pid';

       /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','iduser'
      
    ]; 

    /**
     * a project belongs to a single user
     *
     * @var array
     */
     public function user()
    {
        return $this->belongsTo('App\User','iduser');
    }

    /**
     * a Project has many scales
     *
     * @var array
     */
     public function scales()
    {
        return $this->hasMany('App\Scale','pid','pid');//hasMany('model',foreingnkey,localkey)
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

     /**
     * The project can be shared by many users
     */
    public function sharedUsers()
    {
        
        return $this->belongsToMany('App\User','sharedprojects','pid','iduser');//  belongsToMany('intermediate tablename','id1','id2')
    }

     /**
     * A Project has many datasets
     *
     * @var array
     */
     public function datasets()
    {
        return $this->hasMany('App\DataSet','pid','pid');//hasMany('model',foreingnkey,localkey)
    } 

    /**
     * A Project has many axes
     *
     * @var array
     */
     public function axes()
    {
        return $this->hasMany('App\Axes','pid','pid');//hasMany('model',foreingnkey,localkey)
    } 

    /**
     * A Project has many rect
     *
     * @var array
     */
     public function rects()
    {
        return $this->hasMany('App\Rectangle','pid','pid');//hasMany('model',foreingnkey,localkey)
    } 


     /**
     * A Project has many circles
     *
     * @var array
     */
     public function circles()
    {
        return $this->hasMany('App\Circle','pid','pid');//hasMany('model',foreingnkey,localkey)
    } 

         /**
     * A Project has many pies'
     *
     * @var array
     */
     public function pies()
    {
        return $this->hasMany('App\Pie','pid','pid');//hasMany('model',foreingnkey,localkey)
    } 

}
