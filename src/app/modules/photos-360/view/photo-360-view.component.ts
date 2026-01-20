import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
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

  @ViewChild('panoContainer', { static: false }) panoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('overlayControls', { static: false }) overlayControls?: ElementRef<HTMLDivElement>;
  private pannellumViewer: any = null;
  private subscriptions = new Subscription();

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
  }

  private _instance360ViewerByUrl(url?: string): void {
    if (!url) return;
    if (!this.panoContainer) return;

    this.pannellumService.destroyViewer(this.pannellumViewer);
    const container = this.panoContainer.nativeElement;
    this.pannellumService.createViewer(container, url).then((v: any) => {
      this.pannellumViewer = v;
      this._attachOverlayControls();
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

  goPrevious(): void {
    if (!this.hasPrevious) return;
    const target = this.localidades[this.currentIndex - 1];
    if (target?.id) {
      this._navigateTo(target.id);
    }
  }

  goNext(): void {
    if (!this.hasNext) return;
    const target = this.localidades[this.currentIndex + 1];
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
  }
}
