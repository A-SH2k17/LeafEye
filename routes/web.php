<?php

use App\Http\Controllers\AiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\FertRecomController;
use App\Http\Controllers\NormalUser\FollowerController;
use App\Http\Controllers\NormalUser\MessagesController;
use App\Http\Controllers\NormalUser\PlantMonitorController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\NormalUser\MarketplaceController;
use App\Models\Plant;
use App\Models\Plant_Image;
use App\Models\Plant_Monitor;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminController;

Route::post('/test',function(){
    return 'yes';
});

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
            'exact_time'=>  Carbon::parse($monitor->date_planted)->format('F j, Y H:i:s'),
            "image_path" => $monitor->images->first()->image_path ?? null,
            "id" => $monitor->id,
            "collectionName" => $monitor->collection_name,
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
    Route::post('/profile/request-deletion', [ProfileController::class, 'requestDeletion'])->name('profile.request-deletion');
});


// routes feed
Route::middleware('auth')->controller(FeedController::class)->group(function(){
    Route::get('/feed/{user}', 'index')->name('feed.index');
    Route::post('/post','store')->name('feed.post');
    Route::post('/feed/{user}/{post}/like','like')->name('feed.user_like');
    Route::post('/feed/{user}/{post}/{content}/comment','comment')->name('feed.user_comment');
    Route::get('/getPosts','retrievePosts')->name('feed.getPosts');
    Route::post('/feed/report/{user}/{post}','reportPost')->name('feed.report_post');
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
    Route::get('/plant/image','showImage_index')->name('monitor.monitor_plant');
    Route::post('/plant/image','showImagePost')->name('monitor.monitor_post');
    Route::post('plantMonitor/addImage','imageAddPost')->name('monitor.add_plant_imagePost');
    Route::get('/getCollectionNames','getCollectionNames')->name('monitor.get_collection_names');
    Route::post('/saveDetection','saveDetection')->name('monitor.save_detection');
});


//routes of the Disease
Route::middleware('auth')->controller(AiController::class)->group(function(){
    Route::get('/{user}/detectDisease','disease_index')->name('ai.disease_index');
    Route::post('/crop-disease/detect','detectDisease')->name('ai.disease_detect');
});

// Business Owner Routes
Route::middleware(['auth', 'verified'])->controller(OwnerController::class)->group(function () {
    Route::get('/business/dashboard','index')->name('business.dashboard');
    Route::get('/business/add_product','showAddProduct')->name('business.add_product');
    Route::post('/business/add_product','addProduct')->name('product.add');
    Route::post('/business/updateQuantity/{item_id}/{quantity}','updateQuantity')->name('product.update_quantity');
    Route::delete('/business/updateQuantity/{id}','deleteItem')->name('product.delete');
    Route::get('/business/editItem/{item}','showEditItem')->name('prdouct.show_edit');
    Route::post('/business/editItem','editProduct')->name('product.edit');
});

// Fertilizer recommendation route
Route::middleware('auth')->controller(FertRecomController::class)->group(function(){
    Route::get('/{user}/recommendFertilizer','recommendation_index')->name('ai.recommendation_index');
    Route::post('/{user}/recommendFertilizer','recommend')->name('ai.recommend');

});

// Market place route
Route::middleware('auth')->controller(MarketplaceController::class)->group(function(){
    Route::get('/market/shops','viewShops_index')->name('market.viewShops_index');
    Route::get('/market/{name}/products','viewProducts_index')->name('market.viewProducts_index');
    Route::get('/market/creditInfo','creditInfo_index')->name('market.creditInfo_index');
    Route::get('/market/ordersuc','orderSuccess_index')->name('market.orderSuccess_index');
    Route::post('/market/viewCart','viewCart')->name('market.viewCart');
    Route::post('/market/return','return')->name('market.return');
    Route::post('/market/checkout','checkout')->name('market.checkout');
    Route::post('/market/cancel','cancelCredit')->name('market.cancelCredit');
    Route::post('/market/confirmOrder','confirmOrder')->name('market.confirmOrder');
    Route::post('/market/cancelOrder','cancelOrder')->name('market.cancelOrder');
});

// Messaging and chatbot routes
Route::middleware('auth')->group(function () {
    Route::get('/messages', function () {
        return Inertia::render('AuthenticatedUsers/NormalUsers/Messaging/MessagePage');
    })->name('messages.index');
    
    Route::get('/chatbot', function () {
        return Inertia::render('AuthenticatedUsers/NormalUsers/Chatbot/ChatbotPage');
    })->name('chatbot.index');

    Route::post('/chat/stream',[AiController::class,'ChatbotStream']);
    Route::get('/chat/history', [AiController::class, 'getChatHistory']);
    Route::post('/chat/new', [AiController::class, 'createNewChat']);
    Route::post('/chat/update/{chatId}', [AiController::class, 'updateChat']);
});

// Messaging API routes
Route::middleware('auth')->group(function () {
    Route::get('/api/users', [MessagesController::class, 'getUsers']);
    Route::get('/api/messages/{receiver_id}', [MessagesController::class, 'getConversation']);
    Route::post('/api/messages', [MessagesController::class, 'store']);
});

// Business User Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Order Management Routes
    Route::get('/business/orders', [App\Http\Controllers\BusinessUser\OrderController::class, 'index'])
        ->name('business.orders.index');
    Route::patch('/business/orders/{order}/status', [App\Http\Controllers\BusinessUser\OrderController::class, 'updateStatus'])
        ->name('business.orders.update-status');
});

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('login', [AdminController::class, 'showLogin'])->name('admin.login');
    Route::post('login', [AdminController::class, 'login']);
    
    // Protected admin routes
    Route::middleware(['auth:admin'])->group(function () {
        Route::get('dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::post('shop/decision', [AdminController::class, 'handleShopDecision'])->name('admin.shop.decision');
        Route::delete('user/{id}', [AdminController::class, 'deleteUser'])->name('admin.user.delete');
        Route::delete('post/{id}', [AdminController::class, 'deletePost'])->name('admin.post.delete');
        Route::post('logout', [AdminController::class, 'logout'])->name('admin.logout');
    });
});

// Business routes
Route::middleware(['auth'])->group(function () {
    // ... existing routes ...

    // Business routes
    Route::prefix('business')->group(function () {
        Route::get('/pending', function () {
            return Inertia::render('Business/PendingApproval', [
                'status' => 'pending',
                'reason' => null
            ]);
        })->name('business.pending');
        
        // ... other business routes ...
    });
});

require __DIR__.'/auth.php';
