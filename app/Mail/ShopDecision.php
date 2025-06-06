<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ShopDecision extends Mailable
{
    use Queueable, SerializesModels;

    public $shopName;
    public $decision;
    public $reason;

    /**
     * Create a new message instance.
     */
    public function __construct($shopName, $decision, $reason = null)
    {
        $this->shopName = $shopName;
        $this->decision = $decision;
        $this->reason = $reason;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->decision === 'accepted' 
            ? 'Your Shop Registration Has Been Approved' 
            : 'Your Shop Registration Has Been Rejected';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.shop-decision',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
} 