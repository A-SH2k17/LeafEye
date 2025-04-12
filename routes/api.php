<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\NormalUser\FollowerController;

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
    Route::post('/feed/{user}/{followed_by}/like',[App\Http\Controllers\FeedController::class, 'like']);
    Route::post('/feed/{user}/{post}/follow',[FollowerController::class, 'follow']);
});


//registration api
Route::controller(RegisteredUserController::class)->group(function(){
    Route::get('register','storeapi');
});