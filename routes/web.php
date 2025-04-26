<?php

use App\Http\Controllers\AiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\NormalUser\FollowerController;
use App\Http\Controllers\NormalUser\MessagesController;
use App\Http\Controllers\NormalUser\PlantMonitorController;
use App\Http\Controllers\OwnerController;
use App\Models\Plant;
use App\Models\Plant_Image;
use App\Models\Plant_Monitor;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


//welcome page and default routes
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
    $user_plants = Plant_Monitor::with(['plant', 'images' => function($query) {
        $query->latest()->limit(1);
    }])
    ->where("planted_by", Auth::user()->id)
    ->orderBy('created_at', 'desc')
    ->get()
    ->map(function($monitor) {
        return [
            "type" => $monitor->plant->plant_type,
            "datePlanted" => Carbon::parse($monitor->date_planted)->format('F j, Y'),
            "image_path" => $monitor->images->first()->image_path ?? null,
            "id" => $monitor->id
        ];
    })
    ->toArray();
    return Inertia::render('AuthenticatedUsers/Dashboard',["user_plants"=>$user_plants]);
})->middleware(['auth', 'verified'])->name('users_home');


//profile page routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// routes feed
Route::middleware('auth')->controller(FeedController::class)->group(function(){
    Route::get('/feed/{user}', 'index')->name('feed.index');
    Route::post('/post','store')->name('feed.post');
    Route::post('/feed/{user}/{post}/like','like')->name('feed.user_like');
    Route::post('/feed/{user}/{post}/{content}/comment','comment')->name('feed.user_comment');
    Route::get('/getPosts','retrievePosts')->name('feed.getPosts');
});


//routes messages
Route::middleware('auth')->controller(MessagesController::class)->group(function(){
    Route::get('/messages/{user}','retrieveMessages')->name('message.retrieve');
});

//routes of following and follower
Route::middleware('auth')->controller(FollowerController::class)->group(function(){
    Route::post('/feed/{user}/{followed_by}/follow','follow')->name('feed.user_follow');
    Route::get('/follows/{user}','retrieveFollowers')->name('followers.retrieve');
});

//routes of the PlantMontitor
Route::middleware('auth')->controller(PlantMonitorController::class)->group(function(){
    Route::get('/plantMonitor/{user}/addPlant','index')->name('montor.add_plant_index');
    Route::get('/plantMonitor/{user}/addImage','imageAdd')->name('montor.add_plant_image');
    Route::post('/image/add','addPlantImage')->name('montor.add_plant_image_action');
    Route::post('/plant/add','addPlantDB')->name('monitor.add_plant_submit');
});


//routes of the Disease
Route::middleware('auth')->controller(AiController::class)->group(function(){
    Route::get('/{user}/detectDisease','disease_index')->name('ai.disease_index');
    Route::post('/crop-disease/detect','test')->name('ai.disease_detect');
});

// Business Owner Routes
Route::middleware(['auth', 'verified'])->controller(OwnerController::class)->group(function () {
    Route::get('/business/dashboard','index')->name('business.dashboard');
    Route::get('/business/add_product','showAddProduct')->name('business.add_product');
    Route::post('/business/add_product','addProduct')->name('product.add');
    Route::post('/business/updateQuantity/{item_id}/{quantity}','updateQuantity')->name('product.update_quantity');
    Route::delete('/business/updateQuantity/{id}','deleteItem')->name('product.delete');
    Route::get('/business/editItem/{item}','showEditItem')->name('prdouct.show_edit');
});

require __DIR__.'/auth.php';
