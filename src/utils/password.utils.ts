import * as bcrypt from 'bcrypt';

export class PasswordUtils {
  /**
   * Hashes a plaintext password
   * @param password - Plaintext password
   * @returns Promise<string> - Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares a plaintext password with a hash
   * @param plainText - Plaintext password
   * @param hash - Hashed password
   * @returns Promise<boolean> - True if match
   */
  static async comparePassword(
    plainText: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
