<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Follow extends Model
{
    /** @use HasFactory<\Database\Factories\FollowFactory> */
    protected $fillable =[
        'user',
        'followed_by',
    ];
    use HasFactory,HasApiTokens;

    public function followee()
    {
        return $this->belongsTo(User::class, 'user');
    }

    public function follower()
    {
        return $this->belongsTo(User::class, 'followed_by');
    }
}
