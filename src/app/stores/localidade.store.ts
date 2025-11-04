import { Injectable } from '@angular/core';
import { BaseStore } from './../modules/core/base/base.store';
import { Localidade } from '../models/localidade.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LocalidadeStore extends BaseStore<Localidade> {
  constructor(http: HttpClient) {
    super(http, 'localidade');
  }
}
