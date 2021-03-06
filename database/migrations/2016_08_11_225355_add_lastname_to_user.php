<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLastnameToUser extends Migration
{
    /**
     * Add lastname collumn to users table
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('users', function($table) {
        $table->string('lastname');
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
        Schema::table('users', function($table) {
        $table->dropColumn('lastname');
    });
    }
}
