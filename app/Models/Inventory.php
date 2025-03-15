<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Inventory extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryFactory> */
    use HasFactory, HasApiTokens;

    protected $fillable=[
        'shop_id',
        'quantity',
        'product_id'
    ];
    
    public function shops(){
        return $this->belongsTo(Shop::class);
    }

    public function products(){
        return $this->belongsTo(Product::class);
    }
}
