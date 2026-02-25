# Specification

## Summary
**Goal:** Update the PaywallModal with a new payment disclaimer message and a premium visual redesign.

**Planned changes:**
- Replace the existing payment disclaimer in `PaywallModal.tsx` with the exact text: "Payments are verified manually for this beta launch. Please enter correct UPI Transaction ID. Invalid entries may result in access revocation." displayed in a styled notice box with a shield or info icon.
- Redesign the PaywallModal with a dark/deep-gradient background (navy, slate, or charcoal) and bright Gen-Z accent colors for CTAs.
- Add a prominent shield/security icon near the modal headline.
- Display the UPI ID in a styled monospace pill or highlighted box.
- Give the QR code / payment instruction area a dedicated framed section with padding and a subtle border.
- Style the transaction ID input with larger padding, a visible focus ring, and a descriptive label.
- Style the "Verify & Unlock" button as a high-contrast gradient CTA with a lock or checkmark icon.
- Add subtle dividers between payment steps to guide users through the flow.
- Preserve all existing functional behavior (submitTransactionId mutation, success/error handling, unlock state reload).

**User-visible outcome:** The PaywallModal looks premium and trustworthy with a dark gradient card design, security iconography, clearly styled UPI details, and a prominent CTA button, while displaying the new beta payment verification notice.
