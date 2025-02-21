<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin_Shop_Decisions extends Model
{
    /** @use HasFactory<\Database\Factories\AdminShopDecisionsFactory> */
    use HasFactory;
    protected $fillable = [
        'admin_id',
        'shop_id',
        'decision',
        'date_of_decision',
        'reason_of_rejection',
    ];

    public function admin(){
        return $this->belongsTo(Admin::class);
    }

    public function shop(){
        return $this->belongsTo(Shop::class);
    }
}
