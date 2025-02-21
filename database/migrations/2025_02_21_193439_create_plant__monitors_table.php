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
        Schema::create('plant__monitors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->date('date_planted');
            $table->foreignId('planted_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('plant_id')->constrained('plants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plant__monitors');
    }
};
