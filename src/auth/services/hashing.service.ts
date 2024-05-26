import { Injectable } from '@nestjs/common';
import { hash, genSalt, compare } from 'bcrypt';

@Injectable()
export class HashingService {
  async hash(stuffToHash: string) {
    const salt = await genSalt();
    return await hash(stuffToHash, salt);
  }
  async compare(stuffToCompare: string, hash: string) {
    try {
      const isValid = await compare(stuffToCompare, hash);
      return isValid;
    } catch (error) {
      return false;
    }
  }
}
