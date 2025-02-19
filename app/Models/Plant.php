<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Plant_Image;

class Plant extends Model
{
    /** @use HasFactory<\Database\Factories\PlantFactory> */
    use HasFactory;
    protected $fillable = [
        'plant_type'
    ];

    public function plantImage(){
        return $this->hasMany(Plant_Image::class);
    }
}
