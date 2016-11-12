<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDatasetNameToPie extends Migration
{
      /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
         Schema::table('pie', function($table) {
            $table->string('dataSetName', 100);
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
         Schema::table('pie', function($table) {
            $table->dropColumn('dataSetName');
            
        });
    }
}
