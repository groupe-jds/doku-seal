import ky from 'ky';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = ky.create({
  prefixUrl: API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const session = await getSession();
        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`);
        }
      },
    ],
  },
});
