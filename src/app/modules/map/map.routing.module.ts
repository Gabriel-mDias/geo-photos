import { RouterModule, Routes } from "@angular/router";
import { LocalidadesViewComponent } from "./localidade/localidades-view/localidades-view.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: 'view',
        component: LocalidadesViewComponent
    },
]

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class MapRoutingModule {}