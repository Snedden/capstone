<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePieTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pie', function (Blueprint $table) {
            $table->increments('idpie');
            $table->string('piename', 45)->nullable();
            $table->integer('X_pos')->nullable();
            $table->integer('Y_pos')->nullable();
            $table->integer('innerRadius')->nullable();
            $table->integer('outerRadius')->nullable();
            $table->integer('LabelCol')->nullable()->length(10)->unsigned();
            $table->integer('valueCol')->nullable()->length(10)->unsigned();
            $table->integer('Color')->nullable()->length(10)->unsigned();
            $table->integer('idEntity')->nullable()->length(10)->unsigned();
            $table->timestamps();

            $table->foreign('LabelCol')->references('col_Id')->on('data_sets_columns')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('valueCol')->references('col_Id')->on('data_sets_columns')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('Color')->references('idScales')->on('scales')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('idEntity')->references('idEntities')->on('entities')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pie', function (Blueprint $table) {
            $table->dropForeign(['LabelCol']);
            $table->dropForeign(['valueCol']);
            $table->dropForeign(['Color']);
            $table->dropForeign(['idEntity']);
        });

        Schema::drop('pie');
    }
}