<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use App\Models\Shop;
use App\Models\Admin_Shop_Decisions;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        $admins = Admin::all();
        $admin = null;

        foreach ($admins as $potentialAdmin) {
            if (Hash::check($request->password, $potentialAdmin->password)) {
                $admin = $potentialAdmin;
                break;
            }
        }

        if (!$admin) {
            return back()->withErrors([
                'password' => 'Invalid admin credentials.',
            ]);
        }

        Auth::guard('admin')->login($admin);
        $request->session()->regenerate();

        return redirect()->route('admin.dashboard');
    }

    public function dashboard()
    {
        $pendingShops = Shop::whereDoesntHave('shopAdminDecision')
            ->orWhereHas('shopAdminDecision', function ($query) {
                $query->where('decision', 'pending');
            })
            ->with(['user', 'shopAdminDecision'])
            ->get();

        // Only fetch posts with reports greater than 0
        $reportedPosts = Post::whereHas('reports', function ($query) {
            $query->where('reports_count', '>', 0);
        })
        ->withCount('reports')
        ->with('user')
        ->get()
        ->map(function ($post) {
            return [
                'id' => $post->id,
                'user' => [
                    'username' => $post->user->username,
                ],
                'content' => $post->description,
                'image' => $post->image_path ? asset('storage/' . $post->image_path) : null,
                'reports' => $post->reports_count,
            ];
        });

        $users = User::with(['shops'])
            ->orderBy('last_login', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'last_login' => $user->getLastLoginFormatted(),
                    'time_since_login' => $user->getTimeSinceLastLogin(),
                    'shop_name' => $user->shops ? $user->shops->name : null,
                    'account_status' => $user->account_status,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'updated_at' => $user->updated_at,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'pendingShops' => $pendingShops,
            'reportedPosts' => $reportedPosts,
            'users' => $users,
            'success' => session('success'),
            'error' => session('error')
        ]);
    }

    public function handleShopDecision(Request $request)
    {
        $decision = Admin_Shop_Decisions::create([
            'admin_id' => Auth::guard('admin')->id(),
            'shop_id' => $request->shop_id,
            'decision' => $request->decision,
            'date_of_decision' => now(),
            'reason_of_rejection' => $request->reason_of_rejection
        ]);

        return back()->with('success', 'Decision saved successfully');
    }

    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->update(['account_status' => 'deleted']);
            return back()->with('success', 'User account has been deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete user account. Please try again.']);
        }
    }

    public function deletePost($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return back()->with('success', 'Post deleted successfully');
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }
} 