<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->increments('pid');
            $table->integer('iduser')->nullable()->length(10)->unsigned();
            $table->string('name', 100)->default('New project');
            $table->timestamps();

            $table->foreign('iduser')->references('iduser')->on('users')->onDelete('no action')->onUpdate('no action');
        });

       

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['iduser']);
        });

        Schema::table('charts', function (Blueprint $table) {
            $table->dropForeign(['pid']);
        });

        Schema::drop('projects');
    }
}