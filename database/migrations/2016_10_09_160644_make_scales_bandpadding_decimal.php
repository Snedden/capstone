<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakeScalesBandpaddingDecimal extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('Scales', function($table) {
           
            $table->decimal('bandpadding', 2, 2)->change(); //scale 2 precision 2
           
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
        $table->integer('bandpadding')->nullable();
    }
}
