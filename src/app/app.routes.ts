import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: 'localidades', 
        loadChildren: () => import('./modules/map/map.module').then(m => m.MapModule) 
    },
    {
        path: 'photos-360',
        loadChildren: () => import('./modules/photos-360/photos-360.module').then(m => m.Photos360Module)
    }
];
