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
        Schema::create('plant__images', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('plant_id')->constrained()->onDelete('cascade');
            $table->date('date_taken');
            $table->text('image_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plant__images');
    }
};
