'use server';

import { headers } from 'next/headers';

// Simple in-memory store for rate limiting
// Note: In production, use Redis or a real database
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function submitContactForm(data: {
  nama: string;
  email: string;
  phone: string;
  pesan: string;
}) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // Rate Limiting Logic
  let rateData = rateLimitMap.get(ip);
  if (!rateData || now > rateData.resetTime) {
    rateData = { count: 1, resetTime: now + oneHour };
  } else {
    rateData.count++;
  }
  rateLimitMap.set(ip, rateData);

  if (rateData.count > 3) {
    return { success: false, error: 'Batas pengiriman pesan tercapai. Silakan coba lagi nanti.' };
  }

  // Simulate sending email/storing to DB
  console.log('Form submission received:', data);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

  return { success: true };
}
