<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLabelRadiusOpacityToPie extends Migration
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
            $table->integer('labelRadius')->length(4)->unsigned();
            $table->integer('Opacity')->default(100);
           
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
            $table->dropColumn('labelRadius');
            $table->dropColumn('Opacity');
        });
    }
}
