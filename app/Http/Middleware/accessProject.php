<?php

namespace App\Http\Middleware;

use Closure;
use App\Project;
use Auth;


class accessProject
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $pid=$request->id;
        $project=Project::findOrFail($pid);
        $users=$project->sharedUsers; //all users who share this project
        
        foreach ($users as $user) {
            if(Auth::user()->iduser==$user->iduser){   
                return $next($request);       
            }
        }

        return redirect('/');
    }
}
