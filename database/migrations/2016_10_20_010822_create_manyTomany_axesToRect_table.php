<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateManyTomanyAxesToRectTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
         Schema::create('axes_rectangle', function (Blueprint $table) {
            $table->increments('idAxesRect');
            $table->integer('idRectangle')->length(10)->unsigned();
            $table->integer('idaxes')->length(10)->unsigned();
            $table->string('rectCol', 100);

            $table->foreign('idaxes')->references('idaxes')->on('axes')->onDelete('cascade')->onUpdate('cascade'); 
            $table->foreign('idRectangle')->references('idRectangle')->on('rectangle')->onDelete('cascade')->onUpdate('cascade'); 
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
        Schema::create('axes_rectangle', function (Blueprint $table) {
            $table->dropForeign(['idaxes']);
            $table->dropForeign(['idRectangle']);
        });

        Schema::drop('axes_rectangle');
    }
}
