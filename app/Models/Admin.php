<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Model
{
    /** @use HasFactory<\Database\Factories\AdminFactory> */
    use HasFactory, HasApiTokens;
    protected $fillable = [
        'password'
    ];

    public function shopAdminDecision(){
        return $this->hasMany(Admin_Shop_Decisions::class);
    }

    public function postDeletion(){
        return $this->hasMany(Post_Deletion::class);
    }
}
