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
        Schema::create('admin__shop__decisions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('decision');
            $table->foreignId('admin_id')->constrained('admins');
            $table->foreignId('shop_id')->constrained('shops');
            $table->text('reason_of_rejection')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin__shop__decisions');
    }
};
