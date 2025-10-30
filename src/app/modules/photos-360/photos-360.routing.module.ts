import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { Photo360ViewComponent } from "./view/photo-360-view.component";

const routes: Routes = [
    {
        path: 'view',
        component: Photo360ViewComponent,
    },
]

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class Photos360RoutingModule {}