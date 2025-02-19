<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Plant;

class Plant_Image extends Model
{
    /** @use HasFactory<\Database\Factories\PlantImageFactory> */
    use HasFactory;

    protected $fillable = [
        'image_path',
        'date_taken',
        'plant_id'
    ];

    public function plant(){
        return $this->belongsTo(Plant::class);
    }
}
