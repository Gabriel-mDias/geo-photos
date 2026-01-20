import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Localidade } from '../../../models/localidade.model';
import { PannellumService } from '../../../services/pannellum.service';
import { LocalidadeStore } from '../../../stores/localidade.store';
import { SessionStorageService } from '../../../services/session-storage.service';
import { RouterService } from '../../../services/router.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-photo-360-view',
  templateUrl: './photo-360-view.component.html',
  styleUrl: './photo-360-view.component.scss'
})
export class Photo360ViewComponent implements OnInit, AfterViewInit, OnDestroy {
  ponto?: Localidade | null = null;
  localidades: Localidade[] = [];
  currentIndex: number = -1;
  isFullscreen: boolean = false;
  stepOptions: number[] = [1, 5, 10, 20, 50, 100, 500, 1000];
  stepSize: number = 1;
  private readonly fallbackLatitude = -23.55052;
  private readonly fallbackLongitude = -46.63331;

  @ViewChild('panoContainer', { static: false }) panoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('overlayControls', { static: false }) overlayControls?: ElementRef<HTMLDivElement>;
  @ViewChild('miniMapOverlay', { static: false }) miniMapOverlay?: ElementRef<HTMLDivElement>;
  @ViewChild('miniMapCanvas', { static: false }) miniMapCanvas?: ElementRef<HTMLDivElement>;
  @ViewChild('miniMapToggleOverlay', { static: false }) miniMapToggleOverlay?: ElementRef<HTMLDivElement>;
  private pannellumViewer: any = null;
  private miniMap?: L.Map;
  miniMapBaseLayer: 'osm' | 'esri' = 'osm';
  private miniMapOsmLayer?: L.TileLayer;
  private miniMapEsriLayer?: L.TileLayer;
  private miniMapActiveLayer?: L.TileLayer;
  private miniMapLayer?: L.LayerGroup;
  showMiniMap: boolean = true;
  private subscriptions = new Subscription();
  private readonly fullscreenHandler = () => this._syncFullscreenState();

  constructor(
    private pannellumService: PannellumService,
    private route: ActivatedRoute,
    private store: LocalidadeStore,
    private session: SessionStorageService,
    private routerService: RouterService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.getAll().subscribe({
        next: (data) => {
          this.localidades = data ?? [];
          this._syncCurrentIndex();
          this._updateMiniMap();
        },
        error: () => {
          this.localidades = [];
          this._syncCurrentIndex();
          this._updateMiniMap();
        }
      })
    );

    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id') || this.session.get<string>('selectedLocalidadeId') || undefined;
        if (!id) return;

        this.store.getById(id).subscribe({
          next: (p) => {
            this.ponto = p;
            this._syncCurrentIndex();
            this._updateMiniMap();
            if (this.ponto?.url) {
              this._instance360ViewerByUrl(this.ponto.url);
            }
          },
          error: () => {
            // noop
          }
        });
      })
    );
  }

  ngAfterViewInit(): void {
    // if ponto was loaded before view init, instantiate; otherwise ngOnInit will call instance after fetch
    if (this.ponto && this.ponto.url) {
      this._instance360ViewerByUrl(this.ponto.url);
    }
    document.addEventListener('fullscreenchange', this.fullscreenHandler);
    document.addEventListener('webkitfullscreenchange', this.fullscreenHandler as EventListener);
    this._syncFullscreenState();
  }

  private _instance360ViewerByUrl(url?: string): void {
    if (!url) return;
    if (!this.panoContainer) return;

    this.pannellumService.destroyViewer(this.pannellumViewer);
    const container = this.panoContainer.nativeElement;
    this.pannellumService.createViewer(container, url, { showFullscreenCtrl: false }).then((v: any) => {
      this.pannellumViewer = v;
      this._attachOverlays();
      this._initMiniMap();
      this._updateMiniMap();
      this._syncFullscreenState();
    });
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex >= 0 && this.currentIndex < this.localidades.length - 1;
  }

  get currentPosition(): string {
    if (this.currentIndex < 0 || !this.localidades.length) return '';
    return `${this.currentIndex + 1} / ${this.localidades.length}`;
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented) return;
    if (event.key === 'ArrowRight') {
      this.goNext();
      return;
    }

    if (event.key === 'ArrowLeft') {
      this.goPrevious();
    }
  }

  goPrevious(): void {
    if (!this.hasPrevious) return;
    const targetIndex = Math.max(0, this.currentIndex - this.stepSize);
    const target = this.localidades[targetIndex];
    if (target?.id) {
      this._navigateTo(target.id);
    }
  }

  goNext(): void {
    if (!this.hasNext) return;
    const maxIndex = this.localidades.length - 1;
    const targetIndex = Math.min(maxIndex, this.currentIndex + this.stepSize);
    const target = this.localidades[targetIndex];
    if (target?.id) {
      this._navigateTo(target.id);
    }
  }

  goBackToLocalidades(): void {
    this.routerService.navigateTo('localidades/view');
  }

  private _navigateTo(id: string): void {
    const targetId = String(id);
    this.session.set('selectedLocalidadeId', targetId);
    this.routerService.navigateTo(`photos-360/view/${targetId}`);
  }

  private _attachOverlays(): void {
    if (!this.panoContainer) return;
    const container = this.panoContainer.nativeElement;
    const overlays = [
      this.overlayControls?.nativeElement,
      this.miniMapOverlay?.nativeElement,
      this.miniMapToggleOverlay?.nativeElement
    ].filter(Boolean) as HTMLDivElement[];

    overlays.forEach((overlay) => {
      if (overlay.parentElement !== container) {
        container.appendChild(overlay);
      }
    });
  }

  private _initMiniMap(): void {
    if (this.miniMap || !this.miniMapCanvas) return;
    const element = this.miniMapCanvas.nativeElement;

    this.miniMap = L.map(element, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: true
    });

    this.miniMapOsmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });
    this.miniMapEsriLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© Esri'
      }
    );
    this._applyMiniMapBaseLayer(this.miniMapBaseLayer);

    this.miniMapLayer = L.layerGroup().addTo(this.miniMap);
    this._updateMiniMap();
  }

  private _updateMiniMap(): void {
    if (!this.miniMap || !this.miniMapLayer) return;
    const center = this._getMiniMapCenter();
    const hasPoint = Boolean(this.ponto);
    const layer = this.miniMapLayer;

    layer.clearLayers();

    if (this.localidades.length) {
      const currentId = this.ponto?.id ? String(this.ponto.id) : null;

      this.localidades.forEach((p) => {
        const isSelected = currentId !== null && String(p.id) === currentId;
        const marker = L.circleMarker([p.latitude, p.longitude], {
          radius: isSelected ? 7 : 4,
          color: isSelected ? '#ff6f00' : '#1e88e5',
          weight: isSelected ? 2 : 1,
          fillColor: isSelected ? '#ffca28' : '#42a5f5',
          fillOpacity: isSelected ? 0.9 : 0.75
        }).addTo(layer);

        if (p.nome) {
          marker.bindTooltip(p.nome, { direction: 'top' });
        }

        if (p.id) {
          marker.on('click', () => this._navigateTo(String(p.id)));
        }
      });
    }

    this.miniMap.setView(center, hasPoint ? 16 : 12, { animate: false });
    this._refreshMiniMapSize();
  }

  private _getMiniMapCenter(): [number, number] {
    if (this.ponto) {
      return [this.ponto.latitude, this.ponto.longitude];
    }

    if (this.localidades.length) {
      const totals = this.localidades.reduce(
        (acc, p) => {
          acc.lat += p.latitude;
          acc.lng += p.longitude;
          return acc;
        },
        { lat: 0, lng: 0 }
      );
      return [totals.lat / this.localidades.length, totals.lng / this.localidades.length];
    }

    return [this.fallbackLatitude, this.fallbackLongitude];
  }

  toggleFullscreen(): void {
    if (!this.panoContainer) return;
    const container = this.panoContainer.nativeElement as any;
    const doc: any = document;

    if (this._isFullscreenActive()) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => undefined);
        return;
      }

      if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
      return;
    }

    if (container.requestFullscreen) {
      container.requestFullscreen().catch(() => undefined);
      return;
    }

    if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  }

  private _isFullscreenActive(): boolean {
    const doc: any = document;
    return Boolean(
      document.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }

  private _syncFullscreenState(): void {
    this.isFullscreen = this._isFullscreenActive();
    this._refreshMiniMapSize();
  }

  private _refreshMiniMapSize(): void {
    if (!this.miniMap) return;
    setTimeout(() => {
      this.miniMap?.invalidateSize();
    }, 150);
  }

  zoomMiniMapIn(): void {
    this.miniMap?.zoomIn();
  }

  zoomMiniMapOut(): void {
    this.miniMap?.zoomOut();
  }

  toggleMiniMap(): void {
    this.showMiniMap = !this.showMiniMap;
    if (this.showMiniMap) {
      this._refreshMiniMapSize();
    }
  }

  setMiniMapBaseLayer(kind: 'osm' | 'esri'): void {
    if (this.miniMapBaseLayer === kind) return;
    this.miniMapBaseLayer = kind;
    this._applyMiniMapBaseLayer(kind);
  }

  centerMiniMapOnSelected(): void {
    if (!this.miniMap) return;
    const center = this._getMiniMapCenter();
    this.miniMap.panTo(center, { animate: true });
  }

  resetMiniMapView(): void {
    if (!this.miniMap) return;
    const center = this._getMiniMapCenter();
    const hasPoint = Boolean(this.ponto);
    this.miniMap.setView(center, hasPoint ? 16 : 12, { animate: false });
  }

  private _applyMiniMapBaseLayer(kind: 'osm' | 'esri'): void {
    if (!this.miniMap) return;
    const next = kind === 'esri' ? this.miniMapEsriLayer : this.miniMapOsmLayer;
    if (!next) return;

    if (this.miniMapActiveLayer && this.miniMap.hasLayer(this.miniMapActiveLayer)) {
      this.miniMap.removeLayer(this.miniMapActiveLayer);
    }

    next.addTo(this.miniMap);
    this.miniMapActiveLayer = next;
  }

  private _syncCurrentIndex(): void {
    if (!this.ponto?.id || !this.localidades.length) {
      this.currentIndex = -1;
      return;
    }

    const currentId = String(this.ponto.id);
    this.currentIndex = this.localidades.findIndex((item) => String(item.id) === currentId);
  }

  ngOnDestroy(): void {
    document.removeEventListener('fullscreenchange', this.fullscreenHandler);
    document.removeEventListener('webkitfullscreenchange', this.fullscreenHandler as EventListener);
    this.pannellumService.destroyViewer(this.pannellumViewer);
    this.miniMap?.remove();
    this.subscriptions.unsubscribe();
  }
}
