<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Shop extends Model
{
    /** @use HasFactory<\Database\Factories\ShopFactory> */
    use HasFactory;
    protected $fillable = [
        'commercial_registration',
        'name',
        'type',
        'address',
        'user_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
