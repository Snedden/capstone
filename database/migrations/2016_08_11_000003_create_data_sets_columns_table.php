<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDataSetsColumnsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_sets_columns', function (Blueprint $table) {
            $table->increments('col_Id');
            $table->string('col_name', 100)->nullable();
            $table->string('col_type', 45)->nullable();
            $table->integer('iddata_sets')->length(10)->unsigned();

            $table->foreign('iddata_sets')->references('iddata_sets')->on('data_sets')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('data_sets_columns', function (Blueprint $table) {
            $table->dropForeign(['iddata_sets']);
        });

        Schema::drop('data_sets_columns');
    }
}