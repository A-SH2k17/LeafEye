<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Shop;
use App\Models\User;
use App\Models\Admin_Shop_Decisions;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();
        $user = User::where('email', $request->email)->first();
        
        // Update last login time
        $user->updateLastLogin();
        
        // Create token for API authentication
        $token = $user->createToken(time())->plainTextToken;
        
        // Redirect based on user type
        if ($user->role == "business") {
            $shop = Shop::where('user_id', $user->id)->first();
            
            if ($shop) {
                $decision = Admin_Shop_Decisions::where('shop_id', $shop->id)
                    ->latest()
                    ->first();

                if (!$decision || $decision->decision === 'pending') {
                    // Log out the user if shop is not accepted
                    Auth::logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
                    
                    return Inertia::render('Business/PendingApproval', [
                        'status' => 'pending',
                        'reason' => $decision ? $decision->reason_of_rejection : null
                    ]);
                }

                if ($decision->decision === 'rejected') {
                    // Log out the user if shop is rejected
                    Auth::logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
                    
                    return Inertia::render('Business/Rejected', [
                        'reason' => $decision->reason_of_rejection
                    ]);
                }
            }

            return Inertia::location(
                route('business.dashboard', [
                    'csrfToken' => csrf_token(),
                    'bearer_token' => $token
                ])
            );
        }
        
        return Inertia::location(
            route('users_home', [
                'csrfToken' => csrf_token(),
                'bearer_token' => $token
            ])
        );
    }

    public function storeapi(Request $request)
    {    
       try{
            $user = User::where('email', $request->email)->first();
            

            if($user == null || !Hash::check($request->password, $user->password)){
                Log::info("here");
                return response()->json([
                    'error'=>"Invalid Credentials",
                ],500);
            }
            // Create token for API authentication
            $token = $user->createToken(time())->plainTextToken;
            $shop = Shop::where('user_id',$user->id)->first();
            return response()->json([
                'user' => $user,
                'token' => $token,
                'shop' => $shop,
                'message' => 'User Logged successfully'
            ], 201);

       }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
            ],500);
       }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)//: RedirectResponse
    {
        
        $user = User::where('id',Auth::user()->id)->first();
        $user->tokens()->delete();
        
        Auth::guard('web')->logout();
        
        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return Inertia::location(route('welcome'));
    }
}
