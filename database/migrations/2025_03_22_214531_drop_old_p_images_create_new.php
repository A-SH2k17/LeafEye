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
        Schema::table('plant__images', function (Blueprint $table) {
            Schema::dropIfExists('plant__images');

            Schema::create('plant__images', function (Blueprint $table) {
                $table->id();
                $table->timestamps();
                $table->foreignId('monitor_id')->constrained('plant__monitors')->onDelete('cascade');
                $table->date('date_taken');
                $table->text('image_path');
            });

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plant__images', function (Blueprint $table) {
            Schema::dropIfExists('plant__images');
        });
    }
};
