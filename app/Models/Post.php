<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory,HasApiTokens;

    protected $fillable = [
        'description',
        'image_path',
        'user_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function likes(){
        return $this->hasMany(Like::class);
    }

    public function comments(){
        return $this->hasMany(Comment::class);
    }

    public function postDeletion(){
        return $this->hasOne(Post_Deletion::class);
    }

    public function reports()
    {
        return $this->hasMany(PostReport::class);
    }

    public function isReportedByUser($userId)
    {
        return $this->reports()->where('user_id', $userId)->exists();
    }

    public function scopeReported($query)
    {
        return $query->whereHas('reports')
                    ->withCount('reports')
                    ->orderBy('reports_count', 'desc');
    }
}
