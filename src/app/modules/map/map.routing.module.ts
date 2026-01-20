import { RouterModule, Routes } from "@angular/router";
import { LocalidadesViewComponent } from "./localidade/view/localidades-view.component";
import { NgModule } from "@angular/core";
import { LocalidadeStore } from "../../stores/localidade.store";
import { LocalidadesImportComponent } from "./localidade/import/localidades-import.component";

const routes: Routes = [
    {
        path: 'view',
        component: LocalidadesViewComponent
    },
    {
        path: 'importar',
        component: LocalidadesImportComponent
    },
]

@NgModule({
   providers: [
    LocalidadeStore,
   ],
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class MapRoutingModule {}
