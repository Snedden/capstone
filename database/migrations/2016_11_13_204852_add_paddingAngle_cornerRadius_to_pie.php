<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPaddingAngleCornerRadiusToPie extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pie', function (Blueprint $table) {
            $table->integer('paddingAngle')->length(10)->unsigned()->nullable();
            $table->integer('cornerRadius')->length(10)->unsigned()->nullable();

        
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pie', function (Blueprint $table) {
            $table->dropColumn('paddingAngle');
            $table->dropColumn('cornerRadius');
        });
        
    }
}
