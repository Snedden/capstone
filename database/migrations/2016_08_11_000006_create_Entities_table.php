<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEntitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Entities', function (Blueprint $table) {
            $table->increments('idEntities');
            $table->string('entity_name', 100)->nullable();
            $table->string('entity_type', 45)->nullable();
            $table->integer('pid')->length(10)->unsigned();
            $table->timestamps();

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
        Schema::table('Entities', function (Blueprint $table) {
            $table->dropForeign(['pid']);
        });

        Schema::drop('Entities');
    }
}