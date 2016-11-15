<?php

namespace App\Http\Controllers;

use App\Http\Requests;
/*use Illuminate\Http\Request;*/
use Request;
use App\Project;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {   
        /*$user=Auth::user()->id;
        $projects = User::all();*/

        
        return view('home');
        /*return view('home',compact('projects'));*/
    }
}
