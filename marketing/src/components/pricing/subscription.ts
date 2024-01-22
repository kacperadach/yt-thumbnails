// export type Tier = {
//   name: string;
//   price: {
//     monthly: number;
//     yearly: number;
//   };
//   videos: number | "Unlimited";
//   images: number | "Unlimited";
//   aiImages: number | "Unlimited";
//   aiLora: number | "Unlimited";
//   renders: number | "Unlimited";
//   customTemplates: number | "Unlimited";
//   priceId: {
//     monthly: string;
//     yearly: string;
//   };
// };

export const STARTER_TIER: Tier = {
  name: "Starter",
  price: {
    monthly: 4.99,
    yearly: 49.99,
  },
  videos: 5,
  images: 30,
  aiImages: 10,
  aiLora: 1,
  renders: 10,
  customTemplates: 10,
  priceId: {
    monthly: "price_1OYDnoJt0yxdyPvTwGh2U1qJ",
    yearly: "price_1OYDoAJt0yxdyPvT566MRVcO",
  },
};

export const PRO_TIER: Tier = {
  name: "Pro",
  price: {
    monthly: 9.99,
    yearly: 99.99,
  },
  videos: 15,
  images: 100,
  aiImages: 50,
  aiLora: 1,
  renders: 100,
  customTemplates: 30,
  priceId: {
    monthly: "price_1OYDomJt0yxdyPvTTG7tYXzj",
    yearly: "price_1OYDoyJt0yxdyPvT98OG9r1i",
  },
};

export const PREMIUM_TIER: Tier = {
  name: "Premium",
  price: {
    monthly: 14.99,
    yearly: 149.99,
  },
  videos: "Unlimited",
  images: "Unlimited",
  aiImages: 100,
  aiLora: 5,
  renders: "Unlimited",
  customTemplates: "Unlimited",
  priceId: {
    monthly: "price_1OYDpwJt0yxdyPvTSanqpPMc",
    yearly: "price_1OYDq8Jt0yxdyPvTYdKEERI3",
  },
};
