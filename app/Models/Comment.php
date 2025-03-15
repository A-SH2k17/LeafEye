<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Comment extends Model
{
    /** @use HasFactory<\Database\Factories\CommentFactory> */
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'date_commented',
        'post_id',
        'commented_by',
        'content'
    ];

    public function users(){
        return $this->belongsTo(User::class,'commented_by');
    }

    public function posts(){
        return $this->belongsTo(Post::class);
    }
}
