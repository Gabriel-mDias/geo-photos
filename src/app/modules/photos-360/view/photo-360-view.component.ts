import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Localidade } from '../../../models/localidade.model';
import { PannellumService } from '../../../services/pannellum.service';
import { LocalidadeStore } from '../../../stores/localidade.store';
import { SessionStorageService } from '../../../services/session-storage.service';
import { RouterService } from '../../../services/router.service';

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

  @ViewChild('panoContainer', { static: false }) panoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('overlayControls', { static: false }) overlayControls?: ElementRef<HTMLDivElement>;
  private pannellumViewer: any = null;
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
        },
        error: () => {
          this.localidades = [];
          this._syncCurrentIndex();
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
      this._attachOverlayControls();
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

  private _attachOverlayControls(): void {
    if (!this.panoContainer || !this.overlayControls) return;
    const container = this.panoContainer.nativeElement;
    const overlay = this.overlayControls.nativeElement;

    if (overlay.parentElement !== container) {
      container.appendChild(overlay);
    }
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
    this.subscriptions.unsubscribe();
    this.pannellumService.destroyViewer(this.pannellumViewer);
    document.removeEventListener('fullscreenchange', this.fullscreenHandler);
    document.removeEventListener('webkitfullscreenchange', this.fullscreenHandler as EventListener);
  }
}
