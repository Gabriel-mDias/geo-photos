import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Localidade } from '../../../../models/localidade.model';
import * as L from 'leaflet';

@Component({
  selector: 'view-map-localidades',
  templateUrl: './view-map-localidades.component.html',
  styleUrl: './view-map-localidades.component.scss'
})
export class ViewMapLocalidadesComponent implements AfterViewInit, OnDestroy {

  //Localidade de início
  START_LATITUDE: number = -23.55052
  START_LONGITUDE: number = -46.63331

  /*
   * Variáveis internas 
   */
  localidades: Localidade[] = [];

  /*
   * Getters and Setters 
   */
  map?: L.Map;
  selecionado?: Localidade;
  scene?: any;

  @ViewChild('viewer', { static: false }) viewerRef?: ElementRef<HTMLDivElement>;

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

  ngAfterViewInit(): void {
    this.map = L.map('leaflet-map').setView([this.START_LATITUDE, this.START_LONGITUDE], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.pontos.forEach(p => {
      L.marker([p.latitude, p.longitude])
        .addTo(this.map!)
        .bindTooltip(p.nome)
        .on('click', () => this.onMarkerClick(p));
    });
  }

  onMarkerClick(ponto: Localidade): void {
    this.selecionado = ponto;
    console.log('Ponto selecionado:', ponto);
    setTimeout(() => this.renderizarPanorama(), 0);
  }

  fecharViewer(): void {
    this.selecionado = undefined;
    this.scene = undefined;
  }

  private renderizarPanorama(): void {
    //TODO: Abrir o Marzipano
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
