<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDatasetFkToRect extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('Rectangle', function (Blueprint $table) {
            $table->integer('iddata_sets')->length(10)->unsigned()->nullable();

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
        //
        Schema::table('Rectangle', function (Blueprint $table) {
            $table->dropForeign(['iddata_sets']);
            $table->dropColumn('iddata_sets');
        });
    }
}
