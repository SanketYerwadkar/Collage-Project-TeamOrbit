import { cookies } from 'next/headers';
import { Account, Client, Databases, Storage, Users } from 'node-appwrite';
import 'server-only';

import { AUTH_COOKIE } from '@/features/auth/constants';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
const key = process.env.NEXT_APPWRITE_KEY;

// 🛡️ Validate ENV (to avoid undefined 'startsWith' error)
if (!endpoint) throw new Error('❌ NEXT_PUBLIC_APPWRITE_ENDPOINT is not defined');
if (!project) throw new Error('❌ NEXT_PUBLIC_APPWRITE_PROJECT is not defined');

export async function createSessionClient() {
  const client = new Client().setEndpoint(endpoint).setProject(project);

  const session = cookies().get(AUTH_COOKIE);
  if (!session?.value) throw new Error('Unauthorized: Missing auth session.');

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

export async function createAdminClient() {
  if (!key) throw new Error('❌ NEXT_APPWRITE_KEY is not defined');

  const client = new Client().setEndpoint(endpoint).setProject(project).setKey(key);

  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
  };
}
