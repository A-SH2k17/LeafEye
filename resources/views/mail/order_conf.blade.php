<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Summary</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 6px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
        
        <h2 style="text-align: center;">Order Summary Shop {{$shop}}</h2>
        <p>
            Address: {{$address}}
        </p>
        <p>
            Contact: {{$contact}}
        </p>
        <p>Dear {{$name}} Kindly find the summary of your order below:</p>

        {{-- Product Summary --}}
        <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f0f0f0;">
                    <th align="left">Product</th>
                    <th align="center">Quantity</th>
                    <th align="right">Price</th>
                </tr>
            </thead>
            <tbody>
                @php $total = 0; @endphp
                @foreach ($data as $item)
                    @php
                        $lineTotal = $item['selected_quantity'] * $item['price'];
                        $total += $lineTotal;
                    @endphp
                    <tr>
                        <td>{{ $item['name'] }}</td>
                        <td align="center">{{ $item['selected_quantity'] }}</td>
                        <td align="right">{{ number_format($lineTotal, 2) }} EGP</td>
                    </tr>
                @endforeach
                <tr style="border-top: 2px solid #ccc;">
                    <td colspan="2" align="right"><strong>Total:</strong></td>
                    <td align="right"><strong>{{ number_format($total, 2) }} EGP</strong></td>
                </tr>
            </tbody>
        </table>

        <p style="text-align: center; margin-top: 30px;">Thank you for your order!</p>
    </div>
</body>
</html>
