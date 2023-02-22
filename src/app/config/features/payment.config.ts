import convict, { Schema } from 'convict'

export interface IStripe {
  defaultCurrency: string
  stripePublishableKey: string
  stripeSecretKey: string
  stripeClientID: string
  stripeWebhookSecret: string
}

const paymentFeature: Schema<IStripe> = {
  defaultCurrency: {
    doc: 'Default currency for all payments',
    format: String,
    default: 'sgd',
    env: 'PAYMENT_DEFAULT_CURRENCY',
  },
  stripePublishableKey: {
    doc: 'Stripe Account Publishable Key',
    format: String,
    default: '',
    env: 'PAYMENT_STRIPE_PUBLISHABLE_KEY',
  },
  stripeSecretKey: {
    doc: 'Stripe account Secret Key',
    format: String,
    default: '',
    env: 'PAYMENT_STRIPE_SECRET_KEY',
  },
  stripeClientID: {
    doc: 'Stripe client ID',
    format: String,
    default: '',
    env: 'PAYMENT_STRIPE_CLIENT_ID',
  },
  stripeWebhookSecret: {
    doc: 'Stripe webhook secret',
    format: String,
    default: '',
    env: 'PAYMENT_STRIPE_WEBHOOK_SECRET',
  },
}

export const paymentConfig = convict(paymentFeature)
  .validate({ allowed: 'strict' })
  .getProperties()