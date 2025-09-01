import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapModule } from './modules/map/map.module';
import { ViewMapLocalidadesComponent } from './modules/map/component/view-map-localidades/view-map-localidades.component';
import { CoreModule } from './modules/core/core.module';
import { SidebarComponent } from "./modules/core/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapModule, CoreModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'poc-geo-photos';
}
