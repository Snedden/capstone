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
Route::get('users','usersController@index')->middleware('admin');
Route::get('users/create','usersController@create')->middleware('admin');
//Route::delete('users/{id}','usersController@delete');
Route::get('users/delete/{id}','usersController@delete')->middleware('admin');
Route::get('users/edit/{id}','usersController@edit')->middleware('admin');
Route::post('users/edit/{id}','usersController@update')->middleware('admin');
Route::post('users/add','usersController@store')->middleware('admin');

Route::post('projects/add','projectsController@create')->middleware('auth');
Route::get('projects/{id}','projectsController@index')->middleware('auth');

Route::post('projects/shareProject','shareProjectsController@createShareProject')->middleware('auth');
Route::post('projects/unshareProject','shareProjectsController@deleteShareProject')->middleware('auth');

Route::post('dataset/create/{pid}','datasetController@create')->middleware('auth');
Route::post('dataset/delete','datasetController@delete')->middleware('auth');
Route::get('dataset/columns/{iddata_sets}','datasetController@getCols')->middleware('auth');


Route::post('datasetColumns/update','datasetColumns@updateCols')->middleware('auth');

Route::post('scale/create','scalesController@create')->middleware('auth');
Route::post('scale/delete','scalesController@delete')->middleware('auth');


Route::get('/home', 'HomeController@index')->middleware('auth');
Route::get('/', 'HomeController@index')->middleware('auth');

Route::auth();

//Route::get('/home', 'HomeController@index');
