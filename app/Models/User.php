<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

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
        'last_login',
        'account_status',
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
            'last_login' => 'datetime',
        ];
    }

    /**
     * Update the user's last login timestamp
     */
    public function updateLastLogin(): void
    {
        $this->update(['last_login' => now()]);
    }

    /**
     * Get the formatted last login time
     */
    public function getLastLoginFormatted(): ?string
    {
        return $this->last_login ? $this->last_login->format('Y-m-d H:i:s') : 'Never';
    }

    /**
     * Get the time elapsed since last login
     */
    public function getTimeSinceLastLogin(): ?string
    {
        if (!$this->last_login) {
            return 'Never logged in';
        }

        $now = now();
        $diff = $now->diff($this->last_login);

        if ($diff->days > 0) {
            return $diff->days . ' days ago';
        } elseif ($diff->h > 0) {
            return $diff->h . ' hours ago';
        } elseif ($diff->i > 0) {
            return $diff->i . ' minutes ago';
        } else {
            return 'Just now';
        }
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

    public function followers()
    {
        return $this->hasMany(Follow::class, 'user');
    }

    public function followings()
    {
        return $this->hasMany(Follow::class, 'followed_by');
    }

    
    // public function followerUsers()
    // {
    //     return $this->belongsToMany(User::class, 'follows', 'user', 'followed_by');
    // }

    // public function followingUsers()
    // {
    //     return $this->belongsToMany(User::class, 'follows', 'followed_by', 'user');
    // }

    public function canLogin(): bool
    {
        return $this->account_status !== 'deleted';
    }
}
