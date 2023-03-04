import { Injectable } from '@nestjs/common';
import cheerio, { CheerioAPI } from 'cheerio';
import fetch from 'node-fetch';

@Injectable()
export class CheerioProvider {
  async load(url: string): Promise<CheerioAPI> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    return cheerio.load(html);
  }
}

export function HandleCheerioError() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        if (result && typeof result.then === 'function') {
          return result.then((data: any) => {
            // Clean up
            if (this.cheerioProvider) {
              this.cheerioProvider.load('');
            }
            return data;
          });
        } else {
          // Clean up
          if (this.cheerioProvider) {
            this.cheerioProvider.load('');
          }
          return result;
        }
      } catch (err) {
        throw new Error(
          `Failed to execute method ${propertyKey}: ${err.message}`,
        );
      }
    };
    return descriptor;
  };
}
