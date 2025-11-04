import { RouterModule, Routes } from "@angular/router";
import { LocalidadesViewComponent } from "./localidade/view/localidades-view.component";
import { NgModule } from "@angular/core";
import { LocalidadeStore } from "../../stores/localidade.store";

const routes: Routes = [
    {
        path: 'view',
        component: LocalidadesViewComponent
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