// Mock the Stripe module
const Stripe = jest.genMockFromModule("stripe");

// Simulate creating a payment intent
Stripe.paymentIntents = {
    create: jest.fn(),
};

Stripe.paymentIntents.confirm = jest.fn().mockResolvedValue({
    status: 'Payment succeed',
    id: 'mock_payment_intent_id',
});

module.exports = Stripe;