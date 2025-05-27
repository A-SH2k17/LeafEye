<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('chatbot__interactions', function (Blueprint $table) {
            // First, we need to ensure all existing content is valid JSON
            DB::statement('UPDATE chatbot__interactions SET content = JSON_QUOTE(content) WHERE content IS NOT NULL');
            
            // Then change the column type to JSON
            $table->json('content')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chatbot__interactions', function (Blueprint $table) {
            // Convert JSON back to text
            DB::statement('UPDATE chatbot__interactions SET content = JSON_UNQUOTE(content) WHERE content IS NOT NULL');
            
            $table->text('content')->change();
        });
    }
};
