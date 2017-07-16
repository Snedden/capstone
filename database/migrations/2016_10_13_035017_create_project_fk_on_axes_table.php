<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectFkOnAxesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //drop entity foreign key from  axes table
        Schema::table('axes', function( Blueprint $table) {
            
            $table->dropForeign(['idEntities']);            //drop fk 
            $table->dropColumn('idEntities');               //drop fk column 
            $table->integer('pid')->length(10)->unsigned(); //add pid reference collumn to table
            //add project foreign key to  table
            $table->foreign('pid')->references('pid')->on('projects')->onDelete('cascade')->onUpdate('cascade');   
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //add entity reference to axes table and drop project reference 
        Schema::table('axes', function(Blueprint $table) {
            $table->dropForeign(['pid']);            //drop fk 
            $table->dropColumn('pid');                      //drop fk column 
            $table->integer('idEntities')->length(10)->unsigned(); //add pid reference collumn to table
            //add idEntities foreign key to  table
            $table->foreign('idEntities')->references('idEntities')->on('entities')->onDelete('cascade')->onUpdate('cascade');
        });
    }
}
