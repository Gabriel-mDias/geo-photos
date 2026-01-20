import { Injectable } from "@angular/core";

@Injectable({
   providedIn: 'root',
})
export class PannellumService {
   // Minimal Pannellum loader/initializer service.
   // - Loads CSS/JS (prefers local node_modules, falls back to CDN)
   // - Preloads image to compute aspect ratio and set container height
   // - Instantiates pannellum.viewer and returns it

   private loadCss(href: string): Promise<void> {
      return new Promise((resolve, reject) => {
         if (document.querySelector(`link[href="${href}"]`)) return resolve();
         const link = document.createElement('link');
         link.rel = 'stylesheet';
         link.href = href;
         link.onload = () => resolve();
         link.onerror = (e) => reject(e);
         document.head.appendChild(link);
      });
   }

   private loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
         if (document.querySelector(`script[src="${src}"]`)) return resolve();
         const s = document.createElement('script');
         s.src = src;
         s.async = true;
         s.onload = () => resolve();
         s.onerror = (e) => reject(e);
         document.body.appendChild(s);
      });
   }

   async createViewer(container: HTMLElement, panoUrl: string): Promise<any> {
      if (!container) return null;

      const localCss = '/node_modules/pannellum/build/pannellum.css';
      const localJs = '/node_modules/pannellum/build/pannellum.js';
      const cdnCss = 'https://unpkg.com/pannellum/build/pannellum.css';
      const cdnJs = 'https://unpkg.com/pannellum/build/pannellum.js';

      // container height is controlled by CSS to keep a consistent viewport

      // load assets preferring local
      await Promise.all([
         this.loadCss(localCss).catch(() => this.loadCss(cdnCss)),
         this.loadScript(localJs).catch(() => this.loadScript(cdnJs)),
      ]).catch(() => {
         // ignore, may be handled below
      });

      const pannellum = (window as any).pannellum;
      if (!pannellum || typeof pannellum.viewer !== 'function') {
         // try again to get from window after scripts loaded
         const p = (window as any).pannellum;
         if (!p || typeof p.viewer !== 'function') return null;
      }

      try {
         const viewer = (window as any).pannellum.viewer(container, { type: 'equirectangular', panorama: panoUrl, autoLoad: true });
         return viewer;
      } catch (e) {
         console.error('Pannellum: failed to create viewer', e);
         return null;
      }
   }

   destroyViewer(viewer: any) {
      try {
         if (viewer && typeof viewer.destroy === 'function') viewer.destroy();
      } catch (e) {
         // noop
      }
   }
}
