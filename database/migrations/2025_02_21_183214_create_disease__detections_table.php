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
        Schema::create('disease__detections', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('disease_name');
            $table->text('treatment');
            $table->date('date_requested');
            $table->foreignId('plant_id')->constrained('plants')->onDelete('cascade');
            $table->foreignId('requested_by')->constrained('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disease__detections');
    }
};
