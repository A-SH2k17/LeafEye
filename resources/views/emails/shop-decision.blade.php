<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>{{ $decision === 'accepted' ? 'Shop Registration Approved!' : 'Shop Registration Update' }}</h2>
        </div>
        
        <div class="content">
            <p>Dear Business Owner,</p>

            @if($decision === 'accepted')
                <p>We are pleased to inform you that your shop registration for <strong>{{ $shopName }}</strong> has been approved! You can now start using our platform to manage your business.</p>
                <p>You can log in to your account and start adding products, managing orders, and growing your business.</p>
            @else
                <p>We regret to inform you that your shop registration for <strong>{{ $shopName }}</strong> has been rejected.</p>
                @if($reason)
                    <p><strong>Reason for rejection:</strong><br>
                    {{ $reason }}</p>
                @endif
                <p>You can submit a new registration with the necessary corrections. If you have any questions, please don't hesitate to contact our support team.</p>
            @endif

            <p>Thank you for your interest in our platform.</p>
        </div>

        <div class="footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html> 