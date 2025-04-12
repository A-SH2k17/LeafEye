<?php

namespace App\Http\Middleware;

use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Log;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        
        Log::info('Inertia Request:', [
            'url' => $request->url(),
            'method' => $request->method(),
            'flash' => $request->session()->get('success'),
            'image'=>$request->session()->get('image'),
            'error' => $request->session()->get('error'),
        ]);
        
        $userShop = null;

        if ($request->user() != null && $request->user()->role=="business"){
            $userShop = Shop::where('user_id',$request->user()->id)->first();
        }
        return [
            ...parent::share($request),
            'shop'=> [
                $userShop
            ],
            'auth' => [
                'user' => $request->user(),
            ],
            'api' => [
                \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
                'throttle:api',
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
            ],
        ];
    }
}
