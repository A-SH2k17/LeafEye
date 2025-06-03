<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Shop;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
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
    public function store(Request $request)
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
                'name' => $request->storeName,
                'address' => $request->storeAddress,
                'commercial_registration' => $request->commercialRegistrationNumber,
                'type' => $request->storeType,
                'user_id' => $user->id,
            ]);
            
            // Create token for API authentication
            $token = $user->createToken(time())->plainTextToken;
            
            // Return the pending approval page directly
            return Inertia::render('Business/PendingApproval', [
                'status' => 'pending',
                'reason' => null,
                'csrfToken' => csrf_token(),
                'bearer_token' => $token
            ]);
        }
        $token = $user->createToken(time())->plainTextToken;
        return Inertia::location(
            route('users_home', [
                'csrfToken' => csrf_token(),
                'bearer_token' => $token
            ])
        );
    }


    public function storeapi(Request $request)
    {
        DB::beginTransaction();
        try{
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:255|unique:'.User::class,
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'location' => 'required|string|max:1000',
                'phone_number' => 'required|regex:/(01)[0-9]{9}/',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'customerType' => 'required|in:normal,business',
            ]);
        
            if ($validator->fails()) {
                Log::info($validator->errors());
                Log::info($request->customerType);
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            
            // Create the user
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

            $shop = null;

            if($request->customerType=="business"){
                $shop = Shop::create([
                    'name' => $request->storeName,
                    'address' => $request->storeAddress,
                    'commercial_registration' => $request->commercialRegistrationNumber,
                    'type' => $request->storeType,
                    'user_id' => $user->id,
                ]);
            }
            // Generate token
            $token = $user->createToken(time())->plainTextToken;
            
            DB::commit();
            // Return user data and token
            return response()->json([
                'user' => $user,
                'token' => $token,
                'shop' => $shop,
                'message' => 'User registered successfully'
            ], 200);
        }catch(Exception $e){
            DB::rollBack();
            return response()->json([
                'error'=>$e->getMessage()
            ],500);
        }
        
    }
}


