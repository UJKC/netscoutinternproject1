export const generateSHA256Hash = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Generate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert the ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  
  return hashHex;
};


export const validateSHA256Hash = async (input: string, expectedHash: string): Promise<boolean> => {
    const generatedHash = generateSHA256Hash(input + `5000`); // Generate the hash for the input
    return await generatedHash === expectedHash; // Compare the generated hash with the expected one
};