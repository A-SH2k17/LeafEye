<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Plant_Monitor extends Model
{
    /** @use HasFactory<\Database\Factories\PlantMonitorFactory> */
    use HasFactory,HasApiTokens;

    protected $fillable=[
        'date_planted',
        'planted_by',
        'plant_id',
        'collection_name'
    ];

    public function users(){
        return $this->belongsTo(User::class,'planted_by');
    }

    public function plant(){
        return $this->belongsTo(Plant::class);
    }

    public function images(){
        return $this->hasMany(Plant_Image::class, 'monitor_id');
    }
}
