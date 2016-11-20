<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLabelAngleAndTextAnchorToAxes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('axes', function( Blueprint $table) {
         $table->string('textAnchor', 10)->default('start');
         $table->integer('labelAngle')->length(3)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('axes', function (Blueprint $table) {
            $table->dropColumn('labelAngle');
            $table->dropColumn('textAnchor');
        });
    }
}
