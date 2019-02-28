import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Determine if the localStorage is enabled (private navigation)
   */
  private isLocalStorageEnabled: boolean;

  /**
   * Represent the fact that the localStorage exist on the current navigator (old browser issue)
   */
  private isSessionStorageEnabled: boolean;

  /**
   * current storage backend (localStorage or sessionStorage)
   */
  private storage: any;

  constructor() {
    this.useLocalStorage();
    this.checkSupport();
  }

  /**
   * Can we use the localStorage ?
   */
  public useLocalStorage(): void {
    this.storage = window.localStorage;
  }

  /**
   * Can we use the localStorage ?
   */
  public useSessionStorage(): void {
    this.storage = window.sessionStorage;
  }

  /**
   * Can we use the localStorage ?
   *
   * @returns {boolean}
   */
  public isAvailable(): boolean {
    return this.isSessionStorageEnabled && this.isLocalStorageEnabled;
  }

  /**
   * This method allow to get a value deserialized in the localstorage.
   *
   * @param key string The key of the wanted stored value
   * @returns {any} Returns the stored object, deserialized.
   */
  public get(key: string): any {
    return this.deserialize(this.storage.getItem(key));
  }

  /**
   * This method allow to get a value deserialized in the localstorage.
   *
   * @param key string The key to which associate the value
   * @param value any The value to serialize and to store in the localStorage
   *
   * @return {any}
   */
  public set(key: string, value: any): any {
    if (value === undefined) {
      return this.storage.removeItem(key);
    }
    this.storage.setItem(key, this.serialize(value));
    return value;
  }

  /**
   * This method will remove all the data stored in localStorage except those list on the var 'persistentData'
   *
   * @param keyToDelete Array the list of index to delete
   */
  public flush(keyToDelete: Array<string>): void {
    for (let i: number = 0; i < keyToDelete.length; ++i) {
      this.storage.removeItem(keyToDelete[i]);
    }
  }

  /**
   * This method will remove all the data stored in localStorage
   */
  public clear(): void {
    this.storage.clear();
  }

  /**
   * This method will remove  the data stored in localStorage at the given index
   *
   * @param key string The index we wanted to delete
   */
  public remove(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * Serialize value into JSON
   *
   * @param value
   * @returns string
   */
  private serialize = (value: any): string => {
    return JSON.stringify(value);
  }

  /**
   * Deserialize JSON data
   *
   * @param value
   * @returns any
   */
  private deserialize = (value: string): any => {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn(`The value provided is not a valid JSON ${value}`);
      return null;
    }
  }

  /**
   * Check if localStorage exist and is authorize
   */
  private checkSupport() {
    try {
      this.isSessionStorageEnabled = this.storageAvailable('sessionStorage');
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.info('This browser does not allow sessionStorage (like iOS Safari in private mode)');
      this.isSessionStorageEnabled = false;
    }
    try {
      this.isLocalStorageEnabled = this.storageAvailable('localStorage');
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.info('This browser does not allow localStorage (like iOS Safari in private mode)');
      this.isLocalStorageEnabled = false;
    }
  }

  /**
   * Check if storage is avaiable
   * Following https://www.npmjs.com/package/storage-available
   */
  private storageAvailable(type: string): boolean {
    try {
      const storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }
}
