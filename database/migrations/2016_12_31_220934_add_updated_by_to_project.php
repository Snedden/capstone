<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUpdatedByToProject extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('projects', function( Blueprint $table) {
            $table->integer('updatedby')->nullable()->length(10)->unsigned();
       
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('projects', function( Blueprint $table) {
            $table->dropColumn('updatedby');
            
        });

    }
}
