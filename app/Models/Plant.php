<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Plant extends Model
{
    /** @use HasFactory<\Database\Factories\PlantFactory> */
    use HasFactory,HasApiTokens;
    protected $fillable = [
        'plant_type'
    ];

    public function plantImage(){
        return $this->hasMany(Plant_Image::class);
        
    }

    public function diseaseDetections(){
        return $this->hasMany(Disease_Detection::class);
    }

    public function fertilizerRecommendations(){
        return $this->hasOne(Fertilizer_Recommendation::class);
    }

    public function monitors(){
        return $this->hasMany(Plant_Monitor::class);
    }
}
