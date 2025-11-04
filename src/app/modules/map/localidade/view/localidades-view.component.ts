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
        this.loadMap = true 
      },
      error: () => this.pontos = []
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

}
