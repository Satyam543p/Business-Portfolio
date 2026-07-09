import { Client, Databases, Storage, Account } from 'appwrite';

const client = new Client();

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.warn('Appwrite configuration missing. Please check VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID in your env.');
}

client
  .setEndpoint(endpoint || '')
  .setProject(projectId || '');

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

// Appwrite Database and Collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const AGENCY_PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_AGENCY_PROFILE_COLLECTION_ID;
export const CASE_STUDIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_STUDIES_COLLECTION_ID;
export const CLIENT_LEADS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CLIENT_LEADS_COLLECTION_ID;
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;

export const getFilePreviewUrl = (fileId, width, height, bucketId = STORAGE_BUCKET_ID) => {
  if (!fileId) return '';
  try {
    const res = storage.getFileView(bucketId, fileId);
    if (typeof res === 'string') return res;
    if (res && typeof res === 'object') {
      return res.href || res.toString() || '';
    }
    return '';
  } catch (err) {
    console.error('Error generating preview URL:', err);
    return '';
  }
};

export default client;
