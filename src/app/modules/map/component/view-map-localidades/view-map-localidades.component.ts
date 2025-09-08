import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
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
  _localidades: Localidade[] = [];
  map?: L.Map;
  selecionado?: Localidade;
  scene?: any;
  isFullScreen: boolean = false;
  
  /*
   * Itens do HTML 
   */
  @ViewChild('viewer', { static: false }) viewerRef?: ElementRef<HTMLDivElement>;


  /*
   * Getters and Setters 
   */
  @Input() set localidades(value: Localidade[]) {
    this._localidades = value ?? []
  }

  get localidades(): Localidade[] {
    return this._localidades
  }

  @Input() set showFullscreen(value: boolean) {
    this.isFullScreen = value
  }

  ngAfterViewInit(): void {
    this._initLeaflet()
    this._addingMarksByLocalidades()
  }

  private _initLeaflet(): void {
    debugger
    if( this.map ){
      return
    }

    this.map = L.map('leaflet-map').setView([this.START_LATITUDE, this.START_LONGITUDE], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private _addingMarksByLocalidades(): void {
    this.localidades.forEach(p => {
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
