<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        $user = User::where('email', $request->email)->first();
        
        // Create token for API authentication
        $token = $user->createToken(time())->plainTextToken;
        
        // Redirect based on user type
        if ($user->role == "business") {
            return redirect()->intended(route('business.dashboard', [
                'csrfToken' => csrf_token(),
                'bearer_token' => $token
            ], absolute: false));
        }
        
        return redirect()->intended(route('users_home', [
            'csrfToken' => csrf_token(),
            'bearer_token' => $token
        ], absolute: false));
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

        return redirect('/');
    }
}
