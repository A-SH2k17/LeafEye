<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostReport extends Model
{
    protected $fillable = ['user_id', 'post_id', 'reported_at'];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->reported_at = $model->reported_at ?? now();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
