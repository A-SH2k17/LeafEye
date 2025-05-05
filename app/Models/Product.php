<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory,HasApiTokens;
    protected $fillable = [
        'name',
        'image_path',
        'price',
        'quantity',
        'shop_id',
        'description'
    ];

    public function orderProductDetails(){
        return $this->hasMany(Order_Product_Detail::class);
    }

    public function Shop(){
        return $this->belongsTo(Shop::class);
    }
    
}
