<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'image_path',
        'price',
    ];

    public function orderProductDetails(){
        return $this->hasMany(Order_Product_Detail::class);
    }

    public function inventory(){
        return $this->hasOne(Inventory::class);
    }
}
