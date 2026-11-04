import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const receiptId = searchParams.get("receiptId") || "NA-RCP-2025-08149";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Official University Fee Receipt - ${receiptId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #000; margin: 40px; background: #fff; line-height: 1.4; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
    .header p { margin: 3px 0 0; font-size: 13px; color: #333; }
    .receipt-meta { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
    th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
    th { background: #f4f4f4; text-transform: uppercase; font-size: 11px; }
    .total-row td { font-weight: bold; font-size: 13px; border-top: 2px solid #000; }
    .signatures { display: flex; justify-content: space-between; margin-top: 60px; font-size: 11px; font-weight: bold; }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #2F7BFF; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
      Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <h1>Nitro Azard University</h1>
    <p>Finance & Accounts Division • Green Fields, Vaddeswaram, Andhra Pradesh - 522302</p>
    <p style="font-size: 11px; color: #666; margin-top: 2px;">GSTIN: 37AAATK1024L1Z8</p>
  </div>

  <div class="receipt-meta">
    <div>
      <p><strong>Receipt No:</strong> ${receiptId}</p>
      <p><strong>Payment Date:</strong> 08-Jan-2025</p>
      <p><strong>Payment Mode:</strong> Razorpay NetBanking (HDFC Bank)</p>
      <p><strong>Gateway Ref ID:</strong> pay_Ox8jK9Pq2LzM5</p>
    </div>
    <div style="text-align: right;">
      <p><strong>Student Name:</strong> Aditya Verma</p>
      <p><strong>Registration ID:</strong> 2500040001</p>
      <p><strong>Program:</strong> B.Tech CSE (6th Semester)</p>
      <p><strong>Academic Year:</strong> 2024-2025 Even</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Sl. No.</th>
        <th>Particulars / Fee Breakdown Head</th>
        <th style="text-align: right;">Amount (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Semester 6 Academic Tuition Fee</td>
        <td style="text-align: right;">1,25,000.00</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Special University Amenities & Lab Infrastructure</td>
        <td style="text-align: right;">15,000.00</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Hostel Residential & Dining Charges (Kapil Dev Block A)</td>
        <td style="text-align: right;">42,000.00</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Central Examination & Evaluation Fee</td>
        <td style="text-align: right;">4,500.00</td>
      </tr>
      <tr class="total-row">
        <td colspan="2" style="text-align: right;">TOTAL AMOUNT RECEIVED (INR):</td>
        <td style="text-align: right;">₹ 1,86,500.00</td>
      </tr>
    </tbody>
  </table>

  <p style="font-size: 11px; margin-top: 15px;">
    <strong>Amount in Words:</strong> One Lakh Eighty-Six Thousand Five Hundred Rupees Only.
  </p>

  <div class="signatures">
    <div>Cashier / Accounts Officer</div>
    <div>Finance Officer, Nitro Azard University</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
