<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FeedController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/ai_features',function(){
    return Inertia::render('AiFeatures');
})->name('features_ai');



Route::get('/home', function () {
    return Inertia::render('AuthenticatedUsers/Dashboard');
})->middleware(['auth', 'verified'])->name('users_home');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
// routes feed
Route::middleware('auth')->controller(FeedController::class)->group(function(){
    Route::get('/feed', 'index')->name('feed.index');
    Route::post('/post','store')->name('feed.post');
    Route::get('/getPosts','retrievePosts')->name('feed.getPosts');
});

require __DIR__.'/auth.php';
