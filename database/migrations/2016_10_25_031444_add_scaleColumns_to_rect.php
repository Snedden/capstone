<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddScaleColumnsToRect extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('rectangle', function (Blueprint $table) {
            $table->integer('X_pos')->default(0)->nullable()->change();
            $table->integer('Y_pos')->default(0)->nullable()->change();
            $table->integer('Height')->default(50)->nullable()->change();
            $table->integer('Width')->default(50)->nullable()->change();
            $table->integer('heightScale')->length(10)->unsigned()->nullable();
            $table->integer('widthScale')->length(10)->unsigned()->nullable();
            $table->integer('XScale')->length(10)->unsigned()->nullable();
            $table->integer('YScale')->length(10)->unsigned()->nullable();
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
        Schema::table('rectangle', function (Blueprint $table) {
            $table->dropColumn('heightScale');
            $table->dropColumn('widthScale');
            $table->dropColumn('XScale');
            $table->dropColumn('YScale');
             $table->integer('X_pos')->default(0)->change();
            $table->integer('Y_pos')->default(0)->change();
            $table->integer('Height')->default(50)->change();
            $table->integer('Width')->default(50)->change();
        });
    }
}
