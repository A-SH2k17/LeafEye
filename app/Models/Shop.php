<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Shop extends Model
{
    /** @use HasFactory<\Database\Factories\ShopFactory> */
    use HasFactory,HasApiTokens;
    protected $fillable = [
        'commercial_registration',
        'name',
        'type',
        'address',
        'user_id',
        'description',
        'location',
        'phone_number',
        'email',
        'website',
        'logo',
        'cover_image',
        'status',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

   

    public function shopAdminDecision(){
        return $this->hasMany(Admin_Shop_Decisions::class);
    }

    public function product(){
        return $this->hasMany(Product::class);
    }
}
