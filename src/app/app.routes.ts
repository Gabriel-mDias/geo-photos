import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: 'localidades', 
        loadChildren: () => import('./modules/map/map.module').then(m => m.MapModule) 
    }
];
