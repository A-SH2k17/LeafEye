<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Disease_Detection extends Model
{
    /** @use HasFactory<\Database\Factories\DiseaseDetectionFactory> */
    use HasFactory,HasApiTokens;
    protected $fillable=[
        'disease_name',
        'treatment',
        'requested_by',
        'date_requested',
        'plant_id'
    ];

    public function users(){
        return $this->belongsTo(User::class,'requested_by');
    }

    public function plants(){
        return $this->belongsTo(Plant::class);
    }
}
