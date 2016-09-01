<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::get('users','usersController@index');
Route::get('users/create','usersController@create');
//Route::delete('users/delete/{id}','usersController@delete');
Route::get('users/delete/{id}','usersController@delete');
Route::post('users/add','usersController@store');


Route::get('/', 'HomeController@index');

Route::auth();

//Route::get('/home', 'HomeController@index');
