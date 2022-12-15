import * as crypto from 'crypto';
export const generateId = (): string => {
  return crypto.randomBytes(16).toString('hex');
};
