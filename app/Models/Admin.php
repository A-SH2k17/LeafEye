<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    /** @use HasFactory<\Database\Factories\AdminFactory> */
    use HasFactory;
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
