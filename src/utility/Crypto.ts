import { createHash } from 'crypto';

export const generateSHA256Hash = (input: string): string => {
  // Create a SHA-256 hash using Node's crypto module
  const hash = createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
};

export const validateSHA256Hash = (input: string, expectedHash: string): boolean => {
    const generatedHash = generateSHA256Hash(input); // Generate the hash for the input
    return generatedHash === expectedHash; // Compare the generated hash with the expected one
};