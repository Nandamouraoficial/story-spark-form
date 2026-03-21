export interface MarketingClassification {
  before: string;
  during: string;
  after: string;
  result: string;
  socialProof: string;
  differentiator: string;
}

export interface MarketingOutput {
  headline: string;
  fullTestimonial: string;
  shortVersion: string;
  quotes: string[];
  classification: MarketingClassification;
  suggestedPageTitle: string;
  bestQuote: string;
  formattedAttribution: string;
}
