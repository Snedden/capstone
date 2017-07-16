<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectFkCircle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //drop entity foreign key from  circle table
        Schema::table('circle', function( Blueprint $table) {
            
            $table->dropForeign(['idEntity']);            //drop fk 
            $table->dropColumn('idEntity');               //drop fk column 
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
        //add entity reference to rectangle table and drop project reference 
        Schema::table('circle', function(Blueprint $table) {
            $table->dropForeign(['pid']);            //drop fk 
            $table->dropColumn('pid');                      //drop fk column 
            $table->integer('idEntity')->length(10)->unsigned(); //add pid reference collumn to table
            //add idEntities foreign key to  table
            $table->foreign('idEntity')->references('idEntities')->on('entities')->onDelete('cascade')->onUpdate('cascade');
        });
    }
}
