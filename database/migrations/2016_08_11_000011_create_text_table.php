<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTextTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('text', function (Blueprint $table) {
            $table->increments('idtext');
            $table->string('label', 100);
            $table->string('name', 100)->nullable();
            $table->integer('X_pos')->default(100);
            $table->integer('Y_pos')->nullable()->default(100);
            $table->integer('size')->nullable()->default(12);
            $table->string('font', 45)->nullable();
            $table->integer('angle')->default(0);
            $table->integer('opacity')->nullable()->default(100);
            $table->integer('idEntity')->length(10)->unsigned();
            $table->timestamps();

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
        Schema::table('text', function (Blueprint $table) {
            $table->dropForeign(['idEntity']);
        });

        Schema::drop('text');
    }
}