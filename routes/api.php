<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\NormalUser\FollowerController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

// Authentication routes
Route::get('/test_authenticated',function(){
    return response()->json([
        "message"=>Auth::user(),
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

    Route::get('/plants_home',[App\Http\Controllers\NormalUser\PlantMonitorController::class,'getRecentPlantsApi']);
    Route::get('/plants_monitor',[App\Http\Controllers\NormalUser\PlantMonitorController::class,'getAllPlantsApi']);
    Route::post('/monitor_images',[App\Http\Controllers\NormalUser\PlantMonitorController::class,'getPlantImagesApi']);

    Route::post('/fertilizer_recommendation',[App\Http\Controllers\FertRecomController::class,'recommend']);
    Route::post('/disease_detection',[App\Http\Controllers\AiController::class,'detectDisease']);

});
//registration api
Route::controller(RegisteredUserController::class)->group(function(){
    Route::post('register','storeapi');
});

//login api
Route::controller(AuthenticatedSessionController::class)->group(function(){
    Route::post('login','storeapi');
});

Route::middleware(['cors'])->group(function () {
    Route::get('/test2', function () {
        return response()->json(['message' => 'worked']);
    });
});