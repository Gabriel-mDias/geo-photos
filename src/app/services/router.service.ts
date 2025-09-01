import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
   providedIn: 'root',
})
export class RouterService {

    get currentUrl(): string {
      return this.router.url
   }

    constructor(
        private router: Router,
    ) {}

    navigateTo(url: string) {
        this.router.navigate([url]);
    }
}