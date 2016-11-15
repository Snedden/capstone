<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstname', 'email', 'password','lastname'
    ];
    /**
    *change default primary key column name to 
    */
    protected $primaryKey = 'iduser';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token'
    ];

     /**
     * User can have many projects
     *
     * @var array
     */
    public function projects(){
        return $this->hasMany('App\Project','iduser','iduser'); // hasmany(model,foreignkey,localkey)
    }

      /**
     * User can have many datasets
     *
     * @var array
     */
    public function datasets(){
        return $this->hasMany('App\DataSet','iddata_sets','iduser'); // hasmany(model,foreignkey,localkey)
    }

    /**
     * The user can have many shared projects
     */
    public function sharedProjects()
    {
        
        return $this->belongsToMany('App\SharedProject', 'sharedProjects', 'iduser', 'pid');//  belongsToMany('intermediate tablename','id1','id2')
    }

    /**
    *Check if user is admin
    */
    public function isAdmin(){
        
        if($this->userlevel==1){
            return true;
        }
        else{
            return false;
        }
    }
    
}
