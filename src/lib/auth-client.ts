"use client";

import { createAuthClient } from "better-auth/react";

/**
 * ব্রাউজারের জন্য BetterAuth ক্লায়েন্ট।
 * baseURL না দিলে বর্তমান origin-ই ব্যবহার করে, তাই লোকাল ও ডিপ্লয়েড
 * দুই জায়গাতেই আলাদা কিছু সেট করতে হয় না।
 */
export const authClient = createAuthClient();

export const { useSession, signIn, signUp, signOut, updateUser } = authClient;
