export interface GoogleUserPayload {
  providerAccountId: string;
  email: string;
  name: string | null;
}

export interface GoogleAuthProviderService {
  verifyCredential(credential: string): Promise<GoogleUserPayload>;
}
