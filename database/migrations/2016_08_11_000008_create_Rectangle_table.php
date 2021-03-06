<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRectangleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rectangle', function (Blueprint $table) {
            $table->increments('idRectangle');
            $table->string('rect_name', 100)->nullable();
            $table->integer('X_pos')->default(0);
            $table->integer('Y_pos')->default(0);
            $table->integer('Height')->default(50);
            $table->integer('Width')->default(50);
            $table->integer('Offset_X')->default(0);
            $table->integer('Offset_Y')->default(0);
            $table->integer('Opacity')->nullable()->default(100);
            $table->string('Color', 10)->default('black');
            $table->integer('idScale')->length(10)->unsigned();
            $table->integer('idEntities')->length(10)->unsigned();
            $table->integer('idColorScale')->nullable()->length(10)->unsigned();
            $table->timestamps();

            $table->foreign('idScale')->references('idScales')->on('scales')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('idEntities')->references('idEntities')->on('entities')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('idColorScale')->references('idScales')->on('scales')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rectangle', function (Blueprint $table) {
            $table->dropForeign(['idScale']);
            $table->dropForeign(['idEntities']);
            $table->dropForeign(['idColorScale']);
        });

        Schema::drop('rectangle');
    }
}