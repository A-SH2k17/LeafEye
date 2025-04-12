<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Plant_Image extends Model
{
    /** @use HasFactory<\Database\Factories\PlantImageFactory> */
    use HasFactory,HasApiTokens;

    protected $fillable = [
        'image_path',
        'date_taken',
        'monitor_id'
    ];

    public function plant(){
        return $this->belongsTo(Plant::class);
    }

    public function monitor(){
        return $this->belongsTo(Plant_Monitor::class, 'monitor_id');
    }
}
