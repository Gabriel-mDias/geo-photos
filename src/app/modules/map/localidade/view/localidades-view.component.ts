import { Component, OnInit } from '@angular/core';
import { Localidade } from '../../../../models/localidade.model';
import { LocalidadeStore } from '../../../../stores/localidade.store';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { RouterService } from '../../../../services/router.service';

@Component({
  selector: 'app-localidades-view',
  templateUrl: './localidades-view.component.html',
  styleUrl: './localidades-view.component.scss'
})
export class LocalidadesViewComponent implements OnInit {

  /*
   * Variáveis de controle
   */

  pontos: Localidade[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100, 250, 500];
  pageSize: number = 25;
  currentPage: number = 1;

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

  constructor(
    private store: LocalidadeStore,
    private session: SessionStorageService,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.store.getAll().subscribe({
      next: (data: Localidade[]) => { 
        this.pontos = data || []
        this._syncPagination();
        this.loadMap = true 
      },
      error: () => {
        this.pontos = []
        this._syncPagination();
      }
    });
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

  viewPhoto(id?: string): void {
    if (!id) return;

    this.session.set('selectedLocalidadeId', id);
    this.routerService.navigateTo(`photos-360/view/${id}`);
  }

  viewImport(): void {
    this.routerService.navigateTo('localidades/importar');
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.pontos.length / this.pageSize));
  }

  get pagedLocalidades(): Localidade[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.pontos.slice(start, start + this.pageSize);
  }

  onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isFinite(value) || value <= 0) return;
    this.pageSize = value;
    this.currentPage = 1;
  }

  onPageInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isFinite(value)) return;
    this.currentPage = this._clampPage(Math.floor(value));
  }

  goPreviousPage(): void {
    if (this.currentPage <= 1) return;
    this.currentPage = this.currentPage - 1;
  }

  goNextPage(): void {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage = this.currentPage + 1;
  }

  private _syncPagination(): void {
    this.currentPage = this._clampPage(this.currentPage);
  }

  private _clampPage(page: number): number {
    const total = this.totalPages;
    if (page < 1) return 1;
    if (page > total) return total;
    return page;
  }

}
