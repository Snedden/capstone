<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteDatasetFKOnProject extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('data_sets', function (Blueprint $table) {
            $table->dropForeign(['pid']);
            $table->foreign('pid')->references('pid')->on('projects')->onDelete('cascade')->onUpdate('cascade');
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
            $table->foreign('pid')->references('pid')->on('projects')->onDelete('no action')->onUpdate('cascade');
        });

     
    }
}
