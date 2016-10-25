<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColCoumntoAxesScale extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('rectangle_scales', function (Blueprint $table) {
            $table->string('rectCol', 100);
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
         Schema::table('rectangle_scales', function (Blueprint $table) {
            $table->dropColumn('rectCol'); 
        });
    }
}
