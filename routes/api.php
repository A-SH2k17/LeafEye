<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedController;

// Authentication routes
Route::get('/test_authenticated',function(){
    return response()->json([
        "message"=>"It worked",
    ]);
})->middleware("auth:sanctum");

Route::get('/test',function(){
    return response()->json([
        "message"=>"It worked",
    ]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts', [App\Http\Controllers\FeedController::class, 'getPaginatedPosts']);
});