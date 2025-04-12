<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Shop;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:'.User::class,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'location' => 'required|string|max:1000',
            'phone_number' => 'required|regex:/(01)[0-9]{9}/',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'customerType' => 'required|in:normal,business',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'=>$request->last_name,
            'location' =>$request->location,
            'phone_number'=>$request->phone_number,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role'=>$request->customerType,
            'username'=>$request->username,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect based on user type
        if ($request->customerType === 'business') {
            $shop = Shop::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'location' => $request->location,
                'phone_number' => $request->phone_number,
                'email' => $request->email,
                'user_id' => $user->id,
            ]);
            return redirect(route('business.dashboard', [
                'csrfToken' => csrf_token(),
                'bearer_token' => $user->createToken(time())->plainTextToken
            ], absolute: false));
        }

        return redirect(route('users_home', [
            'csrfToken' => csrf_token(),
            'bearer_token' => $user->createToken(time())->plainTextToken
        ], absolute: false));
    }
}
