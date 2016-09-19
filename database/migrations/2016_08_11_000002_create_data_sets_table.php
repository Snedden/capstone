<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDataSetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_sets', function (Blueprint $table) {
            $table->increments('iddata_sets');
            $table->integer('iduser')->length(10)->unsigned();
            $table->integer('pid')->length(10)->unsigned();
            $table->string('path', 150);
            $table->integer('rows')->default(0);
            $table->timestamps();

            $table->foreign('iduser')->references('iduser')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('pid')->references('pid')->on('projects')->onDelete('no action')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('data_sets', function (Blueprint $table) {
            $table->dropForeign(['iduser']);
        });

        Schema::drop('data_sets');
    }
}