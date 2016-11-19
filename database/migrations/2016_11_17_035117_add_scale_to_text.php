<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddScaleToText extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('text', function (Blueprint $table) {
           
            $table->string('Color',10); //scale 2 precision 2

            $table->integer('sizeScale')->length(10)->unsigned()->nullable();
            $table->integer('XScale')->length(10)->unsigned()->nullable();
            $table->integer('YScale')->length(10)->unsigned()->nullable();
            $table->integer('textScale')->length(10)->unsigned()->nullable();
            
             $table->string('label', 100)->nullable()->change();

            $table->integer('iddata_sets')->length(10)->unsigned()->nullable();


            $table->foreign('iddata_sets')->references('iddata_sets')->on('data_sets')->onDelete('cascade')->onUpdate('cascade'); 
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
        Schema::table('text', function (Blueprint $table) {
           $table->dropColumn('Color');

            $table->dropColumn('XScale');
            $table->dropColumn('YScale');
            $table->dropColumn('sizeScale');
            $table->dropColumn('textScale');
            $table->string('label', 100);


            $table->dropForeign(['iddata_sets']);
            $table->dropColumn('iddata_sets');

        });
    }
}
