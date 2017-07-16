<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateScalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('scales', function (Blueprint $table) {
            $table->increments('idScales');
            $table->string('scale_name', 100)->nullable();
            $table->integer('pid')->nullable()->length(10)->unsigned();
            $table->integer('col_Id')->nullable()->length(10)->unsigned();
            $table->string('type', 45)->nullable();
            $table->integer('range_from')->nullable();
            $table->integer('range_to')->nullable();
            $table->integer('bandpadding')->nullable();
            $table->timestamps();

            $table->foreign('pid')->references('pid')->on('projects')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('col_Id')->references('col_Id')->on('data_sets_columns')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('scales', function (Blueprint $table) {
            $table->dropForeign(['pid']);
            $table->dropForeign(['col_Id']);
        });

        Schema::drop('scales');
    }
}