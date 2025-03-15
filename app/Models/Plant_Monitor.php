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
        'plant_id'
    ];

    public function users(){
        return $this->belongsTo(User::class,'planted_by');
    }

    public function plants(){
        return $this->belongsTo(Plant::class);
    }
}
