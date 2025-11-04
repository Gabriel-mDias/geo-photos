import { Injectable } from "@angular/core";

@Injectable({
   providedIn: 'root',
})
export class SessionStorageService {
    /** Store a JSON-serializable value in sessionStorage under the given key. */
    set<T>(key: string, value: T): void {
        try {
            const json = JSON.stringify(value);
            sessionStorage.setItem(key, json);
        } catch (e) {
            
        }
    }

    /** Retrieve a value previously stored. Returns null if not present or parse fails. */
    get<T>(key: string): T | null {
        try {
            const v = sessionStorage.getItem(key);
            if (!v) return null;
            return JSON.parse(v) as T;
        } catch (e) {
            return null;
        }
    }

    /** Remove a stored value. */
    remove(key: string): void {
        try { sessionStorage.removeItem(key); } catch { /* noop */ }
    }

    /** Clear all session storage. Use with caution. */
    clear(): void {
        try { sessionStorage.clear(); } catch { /* noop */ }
    }
}