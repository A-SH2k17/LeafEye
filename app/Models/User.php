<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'phone_number',
        'location',
        'role',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function posts(){
        return $this->hasMany(Post::class);
    }

    public function shops(){
        return $this->hasOne(Shop::class);
    }

    public function sentMessages(){
        return $this->hasMany(Message::class,'sender_id');
    }
    
    public function recievedMessages(){
        return $this->hasMany(Message::class,'reciever_id');
    }

    public function chatbotInteractions(){
        return $this->hasMany(Chatbot_Interaction::class);
    }

    public function diseaseDetection(){
        return $this->hasMany(Disease_Detection::class);
    }

    public function fertilizerRecommendations(){
        return $this->hasMany(Fertilizer_Recommendation::class);
    }

    public function orders(){
        return $this->hasMany(Order::class);
    }

    public function monitors(){
        return $this->hasMany(Plant_Monitor::class,'planted_by');
    }

    public function likes(){
        return $this->hasMany(Like::class);
    }

    public function comments(){
        return $this->hasMany(Comment::class);
    }
}
