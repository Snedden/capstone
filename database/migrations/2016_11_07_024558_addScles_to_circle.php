<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSclesToCircle extends Migration
{
 /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('circle', function (Blueprint $table) {
           
            $table->integer('radius')->default(50)->nullable()->change();
    
            $table->integer('radiusScale')->length(10)->unsigned()->nullable();
            $table->integer('opacityScale')->length(10)->unsigned()->nullable();
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
        Schema::table('circle', function (Blueprint $table) {
            $table->dropColumn('radiustScale');
            $table->dropColumn('opacityScale');
            $table->dropColumn('XScale');
            $table->dropColumn('YScale');
            $table->integer('radius')->default(50)->change();
          
        });
    }
}
