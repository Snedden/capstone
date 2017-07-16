<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCircleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('circle', function (Blueprint $table) {
            $table->increments('idCircle');
            $table->string('cir_name', 100)->nullable();
            $table->integer('X_pos')->default(100);
            $table->integer('Y_pos')->default(100);
            $table->integer('radius')->nullable()->default(30);
            $table->integer('Opacity')->default(100);
            $table->string('text', 100)->nullable();
            $table->integer('idScale')->length(10)->unsigned();
            $table->integer('idColorScale')->nullable()->length(10)->unsigned();
            $table->integer('idEntity')->length(10)->unsigned();
            $table->timestamps();

            $table->foreign('idScale')->references('idScales')->on('scales')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('idEntity')->references('idEntities')->on('entities')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('idColorScale')->references('idScales')->on('scales')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('circle', function (Blueprint $table) {
            $table->dropForeign(['idScale']);
            $table->dropForeign(['idEntity']);
            $table->dropForeign(['idColorScale']);
        });

        Schema::drop('circle');
    }
}