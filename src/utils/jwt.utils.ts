/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWTInterface } from './interfaces/jwt.interface';

@Injectable()
export class JWTUtilService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a JWT token with the provided payload and expiration time.
   * @param payload - The payload to include in the JWT token.
   * @param expiresIn - The expiration time for the token (default is '12h').
   * @returns A promise that resolves to the generated JWT token.
   */
  async generateJwtToken(
    payload: object,
    expiresIn: string = '12h',
  ): Promise<string> {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid payload for JWT token generation');
      }
      const secret = this.configService.get<string>('JWT_SECRET_KEY');
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: expiresIn,
        algorithm: 'HS256',
        secret: secret,
      });
      return token;
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw new Error('Failed to generate JWT token');
    }
  }

  /**
   * Generates a refresh token with the provided payload and expiration time.
   * @param payload - The payload to include in the refresh token.
   * @param expiresIn - The expiration time for the token (default is '36h').
   * @returns A promise that resolves to the generated refresh token.
   */
  async generateRefreshToken(
    payload: object,
    expiresIn: string = '36h',
  ): Promise<string> {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid payload for JWT token generation');
      }
      const secret = this.configService.get<string>('JWT_SECRET_KEY');
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: expiresIn,
        algorithm: 'HS256',
        secret: secret,
      });
      return token;
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw new Error('Failed to generate JWT token');
    }
  }

  /**
   * Verifies a refresh token and returns a new access token if valid.
   * @param token - The refresh token to verify.
   * @returns A promise that resolves to a new access token if verification is successful.
   * @throws An error if the token is invalid or expired.
   */
  async verifyRefreshToken(token: string): Promise<any> {
    try {
      if (!token) {
        throw new Error('Refresh token is required for verification');
      }
      const secret = this.configService.get<string>('JWT_SECRET');

      const decodedToken = await this.jwtService.verifyAsync<JWTInterface>(
        token,
        {
          secret: secret,
          algorithms: ['HS256'],
        },
      );
      const newAccessToken = await this.generateJwtToken(decodedToken, '12h');
      return newAccessToken;
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   * @param token - The JWT token to verify.
   * @returns A promise that resolves to the decoded payload if verification is successful.
   * @throws An error if the token is invalid or expired.
   */
  async verifyJWTToken(token: string): Promise<any> {
    try {
      if (!token) {
        throw new Error('JWT token is required for verification');
      }
      const secret = this.configService.get<string>('JWT_SECRET');

      const decoded_token = await this.jwtService.verifyAsync<JWTInterface>(
        token,
        {
          secret: secret,
          algorithms: ['HS256'],
        },
      );
      return decoded_token;
    } catch (error) {
      console.error('Error verifying JWT token:', error);
      throw new Error('Invalid or expired JWT token');
    }
  }

  /**
   * Decodes a JWT token without verifying its signature.
   * @param token - The JWT token to decode.
   * @returns A promise that resolves to the decoded payload.
   */
  decodeJWTToken(token: string): Promise<any> {
    try {
      if (!token) {
        throw new Error('JWT token is required for decoding');
      }

      const decoded_token = this.jwtService.decode<JWTInterface>(token, {
        complete: true,
        json: true,
      });

      return Promise.resolve(decoded_token);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      throw new Error('Failed to decode JWT token');
    }
  }
}
