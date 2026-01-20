import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: 'inicio', 
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) 
    },
    { 
        path: 'localidades', 
        loadChildren: () => import('./modules/map/map.module').then(m => m.MapModule) 
    },
    {
        path: 'administracao',
        loadChildren: () => import('./modules/administracao/administracao.module').then(m => m.AdministracaoModule)
    },
    {
        path: 'photos-360',
        loadChildren: () => import('./modules/photos-360/photos-360.module').then(m => m.Photos360Module)
    }
];
