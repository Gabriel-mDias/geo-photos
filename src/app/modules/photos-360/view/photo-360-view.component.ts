import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Localidade } from '../../../models/localidade.model';
import { PannellumService } from '../../../services/pannellum.service';

@Component({
  selector: 'app-photo-360-view',
  templateUrl: './photo-360-view.component.html',
  styleUrl: './photo-360-view.component.scss'
})
export class Photo360ViewComponent implements AfterViewInit, OnDestroy {
  ponto: Localidade = {
    id: 'p1',
    nome: 'Av. Paulista',
    descricao: 'Avenida famosa em São Paulo',
    latitude: -23.561684,
    longitude: -46.655981,
    url: 'https://cdn.eso.org/images/large/pano360-alma.jpg'
  };

  @ViewChild('panoContainer', { static: false }) panoContainer!: ElementRef<HTMLDivElement>;
  private pannellumViewer: any = null;

  constructor(private pannellumService: PannellumService) {}

  ngAfterViewInit(): void {
    this._instance360ViewerByUrl(this.ponto.url);
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
