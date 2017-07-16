<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddScaleFkToAxesAndTicksCol extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //add scale fk to table
         Schema::table('axes', function( Blueprint $table) {
            $table->integer('idScales')->length(10)->unsigned(); //add idScales reference collumn to table
            //add project foreign key to  table
            $table->foreign('idScales')->references('idScales')->on('scales')->onDelete('cascade')->onUpdate('cascade');   
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {   
        Schema::table('axes',function(Blueprint $table){
            $table->dropForeign(['idScales']);            //drop fk 
            $table->dropColumn('idScales');    
        });
        
    }
}
