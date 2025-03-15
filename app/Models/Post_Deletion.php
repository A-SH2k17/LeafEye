<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Post_Deletion extends Model
{
    /** @use HasFactory<\Database\Factories\PostDeletionFactory> */
    use HasFactory,HasApiTokens;

    protected $fillable=[
        'admin_id',
        'post_id',
        'decision',
        'date_of_deletion',
        'reason_of_deletion',
    ];

    public function admin(){
        return $this->belongsTo(Admin::class);
    }

    public function post(){
        return $this->belongsTo(Post::class);
    }
}
