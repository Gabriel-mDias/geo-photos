import { Injectable } from '@angular/core';
import { BaseStore } from './../modules/core/base/base.store';
import { Localidade } from '../models/localidade.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SessionStorageService } from '../services/session-storage.service';

@Injectable()
export class LocalidadeStore extends BaseStore<Localidade> {
  private readonly importKey = 'importedLocalidades';
  private importedLocalidades: Localidade[] | null = null;

  constructor(
    http: HttpClient,
    private session: SessionStorageService
  ) {
    super(http, 'localidade');
  }

  override getAll(params?: HttpParams): Observable<Localidade[]> {
    const imported = this.getImportedLocalidades();
    if (imported) {
      return of(imported);
    }

    return super.getAll(params);
  }

  override getById(id: string | number, params?: HttpParams): Observable<Localidade> {
    const imported = this.getImportedLocalidades();
    if (imported) {
      const targetId = String(id);
      const found = imported.find((item) => String(item.id) === targetId);
      if (found) {
        return of(found);
      }
    }

    return super.getById(id, params);
  }

  setImportedLocalidades(localidades: Localidade[]): void {
    this.importedLocalidades = localidades ?? [];
    this.session.set(this.importKey, this.importedLocalidades);
  }

  clearImportedLocalidades(): void {
    this.importedLocalidades = null;
    this.session.remove(this.importKey);
  }

  getImportedLocalidades(): Localidade[] | null {
    if (this.importedLocalidades && this.importedLocalidades.length) {
      return this.importedLocalidades;
    }

    const stored = this.session.get<Localidade[]>(this.importKey);
    if (stored && stored.length) {
      this.importedLocalidades = stored;
      return stored;
    }

    return null;
  }
}
