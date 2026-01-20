import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeViewComponent } from './view/home-view.component';

const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
