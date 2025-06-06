<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Order_Product_Detail extends Model
{
    /** @use HasFactory<\Database\Factories\OrderProductDetailFactory> */
    use HasFactory,HasApiTokens;
    protected $fillable =[
        'order_id',
        'product_id',
        'quantity'
    ];

    public function order(){
        return $this->belongsTo(Order::class);
    }

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
