import { Component } from '@angular/core';
import { Localidade } from '../../../../models/localidade.model';

@Component({
  selector: 'app-localidades-view',
  templateUrl: './localidades-view.component.html',
  styleUrl: './localidades-view.component.scss'
})
export class LocalidadesViewComponent {

  /*
   * Variáveis de controle
   */

  /**
   * mock localidades. Deveria vir do Backend
   */
  pontos: Localidade[] = [
      {
        id: 'p1',
        nome: 'Av. Paulista',
        descricao: 'Avenida famosa em São Paulo',
        latitude: -23.561684,
        longitude: -46.655981,
        url: 'https://your-cdn.com/panos/paulista.jpg'
      },
      {
        id: 'p2',
        nome: 'Ibirapuera',
        latitude: -23.587416,
        longitude: -46.657634,
        url: 'https://your-cdn.com/panos/ibirapuera.jpg'
      },
      {
        id: 'p3',
        nome: 'Vila Madalena',
        descricao: 'Bairro boêmio de São Paulo',
        latitude: -23.555465,
        longitude: -46.691505,
        url: 'https://your-cdn.com/panos/vila-madalena.jpg'
      },
    ];

  /*
   * Variáveis internas do componente 
   */

  loadMap: boolean = false;
  loadLocalidades: boolean = false;
  showHeader: boolean = true;

  /*
   * Getters and Setters 
   */
  get showLocalidadesList(): boolean {
    return this.pontos && this.pontos.length > 0
  }

  get showOnlyMap(): boolean {
    return !this.showHeader && !this.loadLocalidades && this.loadMap
  }


  /*
   * Actions
   */

  clickLocalidades(): void {
    this.loadLocalidades = !this.loadLocalidades 
  }

  clickMap(): void {
    this.loadMap = !this.loadMap
  }

  clickFullscreenMap(): void {
    if( !this.showHeader ){
      this.showHeader = true;
      this.loadLocalidades = false;
      return;
    }

    this.showHeader = false;
    this.loadLocalidades = false;
  }

}
