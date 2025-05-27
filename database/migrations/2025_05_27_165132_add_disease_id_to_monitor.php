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
            $table->foreignId("disease_detection_id")
            ->nullable()
            ->constrained("disease__detections");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plant__images', function (Blueprint $table) {
            $table->dropForeign(['disease_detection_id']);
            $table->dropColumn('disease_detection_id');
        });
    }
};
