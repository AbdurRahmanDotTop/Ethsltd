'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function clearNextjsCache() {
  try {
    // Revalidates all routes in the App Router cache
    revalidatePath('/', 'layout');
    return { success: true, message: 'Application cache cleared successfully.' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to clear application cache.' };
  }
}
