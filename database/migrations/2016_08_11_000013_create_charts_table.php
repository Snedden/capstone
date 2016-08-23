<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('charts', function (Blueprint $table) {
            $table->increments('idcharts');
            $table->integer('iduser')->length(10)->unsigned();
            $table->string('path', 150);
            $table->integer('pid');
            $table->timestamps();

            $table->foreign('iduser')->references('iduser')->on('users')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('charts', function (Blueprint $table) {
            $table->dropForeign(['iduser']);
        });

        Schema::drop('charts');
    }
}