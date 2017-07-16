<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropScaleFkInCircle extends Migration
{
/**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        //drop entity foreign key from  rectangle table
        Schema::table('circle', function( Blueprint $table) {
            
            $table->dropForeign(['idScale']);            //drop fk 
            $table->dropColumn('idScale');               //drop fk column 
           
             
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('circle', function($table) {
            $table->integer('idScale')->length(10)->unsigned();
            $table->foreign('idScale')->references('idScales')->on('scales')->onDelete('cascade')->onUpdate('cascade');
        });
     
    }
}
