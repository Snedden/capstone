<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSharedProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sharedprojects', function (Blueprint $table) {
            $table->increments('sharedProjectsid');
            $table->integer('iduser')->length(10)->unsigned();
            $table->integer('pid')->length(10)->unsigned();
            $table->timestamps();

            $table->unique(['iduser', 'pid']);

            $table->foreign('iduser')->references('iduser')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->foreign('pid')->references('pid')->on('projects')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sharedprojects', function (Blueprint $table) {
            $table->dropForeign(['iduser']);
            $table->dropForeign(['pid']);
        });

        Schema::drop('sharedprojects');
    }
}