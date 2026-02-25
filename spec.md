# Specification

## Summary
**Goal:** Replace the placeholder UPI QR code image in the PaywallModal with the real user-uploaded UPI QR code for NIDHI AESTICARE.

**Planned changes:**
- Save the uploaded UPI QR code image (showing "NIDHI AESTICARE", UPI ID: nidhi.aesticare@okhdfcbank, and Google Pay logo) as the static asset at `frontend/public/assets/generated/upi-qr.png`
- Update the PaywallModal to reference this new image at `/assets/generated/upi-qr.png`

**User-visible outcome:** Users opening the PaywallModal will see the real UPI QR code for NIDHI AESTICARE, which they can scan to pay using any UPI app.
