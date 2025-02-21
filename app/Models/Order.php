<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable=[
        'date_ordered',
        'user_id'
    ];

    public function users(){
        return $this->belongsTo(User::class);
    }

    public function orderProductDetails(){
        return $this->hasMany(Order_Product_Detail::class);
    }
}
