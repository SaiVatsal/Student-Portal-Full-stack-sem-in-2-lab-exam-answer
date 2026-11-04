import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDatabase, AcademicService } from "@/server/db";

const processedEvents = new Set<string>();

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-razorpay-signature");
    const rawBody = await request.text();
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "demo_webhook_secret";

    // 1. Verify HMAC SHA-256 signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (process.env.NODE_ENV === "production" && signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.payload?.payment?.entity?.id || `evt-${Date.now()}`;

    // 2. Enforce Idempotency
    if (processedEvents.has(eventId)) {
      return NextResponse.json({ status: "already_processed" });
    }
    processedEvents.add(eventId);

    const store = getDatabase();

    // 3. Process payment.captured event
    if (payload.event === "payment.captured" || payload.event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const studentId = paymentEntity?.notes?.student_id || "e0000000-0000-0000-0000-000000000001";
      const amount = (paymentEntity?.amount || 18650000) / 100;
      const receiptNumber = `NA-RCP-${Date.now().toString().slice(-6)}`;

      // Update student fee dues
      const dues = store.feeDues.get(studentId) || [];
      dues.forEach((d) => {
        d.amountPaid = d.amountDue;
        d.status = "paid";
      });

      // Append fee transaction
      const txs = store.feeTransactions.get(studentId) || [];
      txs.unshift({
        id: `tx-${Date.now()}`,
        receiptNumber,
        date: new Date().toISOString().split("T")[0],
        amount,
        paymentMethod: paymentEntity?.method || "UPI / Razorpay",
        status: "success",
      });
      store.feeTransactions.set(studentId, txs);

      await AcademicService.recordAuditLog(
        studentId,
        "WEBHOOK_FEE_PAID",
        "fee_transactions",
        receiptNumber,
        `Reconciled online payment of INR ${amount.toLocaleString("en-IN")}`
      );
    }

    return NextResponse.json({ status: "success", received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
