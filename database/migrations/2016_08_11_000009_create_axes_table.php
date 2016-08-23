<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAxesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('axes', function (Blueprint $table) {
            $table->increments('idaxes');
            $table->string('name', 100)->nullable();
            $table->string('orient', 10)->nullable();
            $table->integer('X_pos')->default(0);
            $table->integer('Y_pos')->default(0);
            $table->string('Stroke', 10)->default('black');
            $table->integer('Thickness');
            $table->integer('idEntities')->length(10)->unsigned();

            $table->foreign('idEntities')->references('idEntities')->on('Entities')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('axes', function (Blueprint $table) {
            $table->dropForeign(['idEntities']);
        });

        Schema::drop('axes');
    }
}