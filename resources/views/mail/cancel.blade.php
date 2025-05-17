<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Cancellation Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 6px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
        
        <h2 style="text-align: center; color: #e74c3c;">Order Cancelled</h2>

        <p>Dear {{$name}},</p>
        <p>We confirm that your order has been successfully <strong>cancelled</strong>. Below is a summary of the canceled items for your reference:</p>

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
                    <td colspan="2" align="right"><strong>Total Refunded:</strong></td>
                    <td align="right"><strong>{{ number_format($total, 2) }} EGP</strong></td>
                </tr>
            </tbody>
        </table>

        <p style="text-align: center; margin-top: 30px;">
            If you have any questions or need further assistance, feel free to contact our support team.
        </p>

        <p style="text-align: center; margin-top: 10px; color: #999;">
            Thank you for choosing us.
        </p>
    </div>
</body>
</html>
