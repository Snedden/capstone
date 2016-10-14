<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTicksColToAxes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //add ticks columns
        Schema::table('axes', function($table) {
            $table->integer('ticks')->length(3)->unsigned();
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
         //drop ticks columns
        Schema::table('axes', function($table) {
            $table->dropColumn('ticks');
           
        });
    }
}
