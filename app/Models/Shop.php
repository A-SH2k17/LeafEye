<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


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

    public function inventory(){
        return $this->hasOne(Inventory::class);
    }

    public function shopAdminDecision(){
        return $this->hasOne(Admin_Shop_Decisions::class);
    }
}
