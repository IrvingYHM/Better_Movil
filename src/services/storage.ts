import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export class StorageService {
  
  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await Preferences.set({
          key,
          value
        });
        console.log(`Stored ${key} using Capacitor Preferences`);
      } else {
        localStorage.setItem(key, value);
        console.log(`Stored ${key} using localStorage`);
      }
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      // Fallback to localStorage
      localStorage.setItem(key, value);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      if (Capacitor.isNativePlatform()) {
        const result = await Preferences.get({ key });
        console.log(`Retrieved ${key} using Capacitor Preferences:`, !!result.value);
        return result.value;
      } else {
        const value = localStorage.getItem(key);
        console.log(`Retrieved ${key} using localStorage:`, !!value);
        return value;
      }
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      // Fallback to localStorage
      return localStorage.getItem(key);
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await Preferences.remove({ key });
        console.log(`Removed ${key} using Capacitor Preferences`);
      } else {
        localStorage.removeItem(key);
        console.log(`Removed ${key} using localStorage`);
      }
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      // Fallback to localStorage
      localStorage.removeItem(key);
    }
  }

  static async clear(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await Preferences.clear();
        console.log('Cleared all data using Capacitor Preferences');
      } else {
        localStorage.clear();
        console.log('Cleared all data using localStorage');
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      // Fallback to localStorage
      localStorage.clear();
    }
  }

  static async keys(): Promise<string[]> {
    try {
      if (Capacitor.isNativePlatform()) {
        const result = await Preferences.keys();
        return result.keys;
      } else {
        return Object.keys(localStorage);
      }
    } catch (error) {
      console.error('Error getting keys:', error);
      // Fallback to localStorage
      return Object.keys(localStorage);
    }
  }
}