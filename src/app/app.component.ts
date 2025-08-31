import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapModule } from './modules/map/map.module';
import { ViewMapLocalidadesComponent } from './modules/map/component/view-map-localidades/view-map-localidades.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'poc-geo-photos';
}
