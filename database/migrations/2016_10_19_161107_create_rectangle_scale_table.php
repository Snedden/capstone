<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRectangleScaleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('rectangle_scales', function (Blueprint $table) {
            $table->increments('idrectscales');
            $table->integer('idRectangle')->length(10)->unsigned();
            $table->integer('idScales')->length(10)->unsigned();

            $table->foreign('idScales')->references('idScales')->on('Scales')->onDelete('cascade')->onUpdate('cascade'); 
            $table->foreign('idRectangle')->references('idRectangle')->on('Rectangle')->onDelete('cascade')->onUpdate('cascade'); 
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
         Schema::table('rectangle_scales', function (Blueprint $table) {
            $table->dropForeign(['idScales']);
            $table->dropForeign(['idRectangle']);
        });

        Schema::drop('rectangle_scales');
    }
}
