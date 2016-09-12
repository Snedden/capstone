<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SharedProject extends Model
{
    //
    /*protected $primary_key='iduser';
    protected $primary_key='pid';*/

    protected $primaryKey = 'sharedProjectsid';
    protected $table = 'sharedprojects';
   
}
