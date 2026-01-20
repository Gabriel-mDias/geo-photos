import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Localidade } from '../../../../models/localidade.model';
import * as L from 'leaflet';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { RouterService } from '../../../../services/router.service';

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
  private markerLayer?: L.LayerGroup;
  private readonly maxMarkers = 2000;
  private mapEventsBound = false;
  private pendingRender?: number;
  private lastCenteredCount = 0;
  baseLayer: 'osm' | 'esri' = 'osm';
  private osmLayer?: L.TileLayer;
  private esriLayer?: L.TileLayer;
  private activeBaseLayer?: L.TileLayer;
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
    this._centerMapIfNeeded()
    this._refreshMarkers()
  }

  get localidades(): Localidade[] {
    return this._localidades
  }

  @Input() set showFullscreen(value: boolean) {
    this.isFullScreen = value
    this._renderizarMapaAposResize()
  }

  constructor(
      private session: SessionStorageService,
      private routerService: RouterService
  ) {}

  ngAfterViewInit(): void {
    this._initLeaflet()
    this._addingMarksByLocalidades()
    this._centerMapIfNeeded()
  }

  private _initLeaflet(): void {
    if( this.map ){
      return
    }

    L.Icon.Default.imagePath = '/media/';

    this.map = L.map('leaflet-map', { preferCanvas: true }).setView([this.START_LATITUDE, this.START_LONGITUDE], 13);

    this.osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });
    this.esriLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© Esri'
      }
    );
    this._applyBaseLayer(this.baseLayer);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this._bindMapEvents();
  }

  private _addingMarksByLocalidades(): void {
    this._refreshMarkers();
  }

  private _bindMapEvents(): void {
    if (!this.map || this.mapEventsBound) return;
    this.map.on('moveend zoomend', this._onMapMove);
    this.mapEventsBound = true;
  }

  private _onMapMove = (): void => {
    this._refreshMarkers();
  };

  private _refreshMarkers(): void {
    if (!this.map || !this.markerLayer) return;

    if (this.pendingRender) {
      window.clearTimeout(this.pendingRender);
      this.pendingRender = undefined;
    }

    this.pendingRender = window.setTimeout(() => {
      this.pendingRender = undefined;
      this.markerLayer?.clearLayers();

      const bounds = this.map?.getBounds();
      const paddedBounds = bounds ? bounds.pad(0.15) : null;
      const list = paddedBounds
        ? this.localidades.filter((p) => paddedBounds.contains([p.latitude, p.longitude]))
        : this.localidades;

      const step = list.length > this.maxMarkers ? Math.ceil(list.length / this.maxMarkers) : 1;
      const limited: Localidade[] = [];
      for (let i = 0; i < list.length; i += step) {
        limited.push(list[i]);
      }

      const chunkSize = 300;
      let index = 0;
      const addChunk = () => {
        if (!this.markerLayer) return;
        const end = Math.min(index + chunkSize, limited.length);
        for (let i = index; i < end; i += 1) {
          const p = limited[i];
          L.circleMarker([p.latitude, p.longitude], {
            radius: 5,
            color: '#1565c0',
            weight: 1,
            fillColor: '#1e88e5',
            fillOpacity: 0.75,
          })
            .addTo(this.markerLayer)
            .bindTooltip(p.nome)
            .on('click', () => this.onMarkerClick(p));
        }
        index = end;
        if (index < limited.length) {
          window.setTimeout(addChunk, 0);
        }
      };

      addChunk();
    }, 80);
  }

  private _centerMapIfNeeded(): void {
    if (!this.map || !this.localidades.length) return;
    if (this.lastCenteredCount === this.localidades.length) return;

    const totals = this.localidades.reduce(
      (acc, p) => {
        acc.lat += p.latitude;
        acc.lng += p.longitude;
        return acc;
      },
      { lat: 0, lng: 0 }
    );

    const avgLat = totals.lat / this.localidades.length;
    const avgLng = totals.lng / this.localidades.length;
    const zoom = this.map.getZoom() || 13;

    this.map.setView([avgLat, avgLng], zoom, { animate: false });
    this.lastCenteredCount = this.localidades.length;
  }

  onMarkerClick(ponto: Localidade): void {
    this.viewPhoto(ponto.id)
  }

  viewPhoto(id?: string): void {
    if (!id) return;

    this.session.set('selectedLocalidadeId', id);
    this.routerService.navigateTo(`photos-360/view/${id}`);
  }

  fecharViewer(): void {
    this.selecionado = undefined;
    this.scene = undefined;
  }

  private _renderizarMapaAposResize(): void {
    if( !this.map ) return

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 150);
  }

  setBaseLayer(kind: 'osm' | 'esri'): void {
    if (this.baseLayer === kind) return;
    this.baseLayer = kind;
    this._applyBaseLayer(kind);
  }

  private _applyBaseLayer(kind: 'osm' | 'esri'): void {
    if (!this.map) return;
    const next = kind === 'esri' ? this.esriLayer : this.osmLayer;
    if (!next) return;

    if (this.activeBaseLayer && this.map.hasLayer(this.activeBaseLayer)) {
      this.map.removeLayer(this.activeBaseLayer);
    }

    next.addTo(this.map);
    this.activeBaseLayer = next;
  }

  ngOnDestroy(): void {
    this.map?.off('moveend zoomend', this._onMapMove);
    this.map?.remove();
  }
}
