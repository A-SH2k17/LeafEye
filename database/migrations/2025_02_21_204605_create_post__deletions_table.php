<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('post__deletions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->date('date_of_deletion');
            $table->foreignId('admin_id')->constrained('admins');
            $table->foreignId('post_id')->constrained('posts');
            $table->text('reason_of_deletion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post__deletions');
    }
};
