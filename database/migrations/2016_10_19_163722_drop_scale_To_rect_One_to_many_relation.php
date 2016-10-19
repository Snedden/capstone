<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropScaleToRectOneToManyRelation extends Migration
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
        Schema::table('Rectangle', function( Blueprint $table) {
            
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
        //
        $table->integer('idScale')->length(10)->unsigned();
        $table->foreign('idScale')->references('idScales')->on('Scales')->onDelete('cascade')->onUpdate('cascade');
    }
}
