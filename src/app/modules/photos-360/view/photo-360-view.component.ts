import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Localidade } from '../../../models/localidade.model';
import { PannellumService } from '../../../services/pannellum.service';
import { LocalidadeStore } from '../../../stores/localidade.store';
import { SessionStorageService } from '../../../services/session-storage.service';

@Component({
  selector: 'app-photo-360-view',
  templateUrl: './photo-360-view.component.html',
  styleUrl: './photo-360-view.component.scss'
})
export class Photo360ViewComponent implements OnInit, AfterViewInit, OnDestroy {
  ponto?: Localidade | null = null;

  @ViewChild('panoContainer', { static: false }) panoContainer!: ElementRef<HTMLDivElement>;
  private pannellumViewer: any = null;

  constructor(
    private pannellumService: PannellumService,
    private route: ActivatedRoute,
    private store: LocalidadeStore,
    private session: SessionStorageService,
  ) {}

  ngOnInit(): void {
    // try to get id from route params, fallback to session storage
    const id = this.route.snapshot.paramMap.get('id') || this.session.get<string>('selectedLocalidadeId') || undefined;
    if (!id) return;

    this.store.getById(id).subscribe({
      next: (p) => {
        this.ponto = p;
        // instantiate viewer if view already initialized
        if (this.panoContainer && this.ponto && this.ponto.url) {
          this._instance360ViewerByUrl(this.ponto.url);
        }
      },
      error: () => {
        // noop
      }
    });
  }

  ngAfterViewInit(): void {
    // if ponto was loaded before view init, instantiate; otherwise ngOnInit will call instance after fetch
    if (this.ponto && this.ponto.url) {
      this._instance360ViewerByUrl(this.ponto.url);
    }
  }

  private _instance360ViewerByUrl(url?: string): void {
    if (!url) return;
    
    const container = this.panoContainer.nativeElement;
    this.pannellumService.createViewer(container, url).then((v: any) => {
      this.pannellumViewer = v;
    });
  }

  ngOnDestroy(): void {
    this.pannellumService.destroyViewer(this.pannellumViewer);
  }
}
