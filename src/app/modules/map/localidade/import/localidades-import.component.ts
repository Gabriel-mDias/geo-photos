import { Component } from '@angular/core';
import { Localidade } from '../../../../models/localidade.model';
import { LocalidadeStore } from '../../../../stores/localidade.store';
import { RouterService } from '../../../../services/router.service';

interface CsvParseResult {
  localidades: Localidade[];
  errors: string[];
  rawCount: number;
}

@Component({
  selector: 'app-localidades-import',
  templateUrl: './localidades-import.component.html',
  styleUrl: './localidades-import.component.scss'
})
export class LocalidadesImportComponent {
  fileName: string | null = null;
  localidades: Localidade[] = [];
  errors: string[] = [];
  rawCount: number = 0;
  readonly previewLimit = 12;

  constructor(
    private store: LocalidadeStore,
    private routerService: RouterService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const result = this.parseCsv(text);
      this.localidades = result.localidades;
      this.errors = result.errors;
      this.rawCount = result.rawCount;
    };
    reader.readAsText(file);
  }

  importarParaMemoria(): void {
    if (!this.localidades.length) return;
    this.store.setImportedLocalidades(this.localidades);
    this.routerService.navigateTo('localidades/view');
  }

  limparImportacao(): void {
    this.localidades = [];
    this.errors = [];
    this.rawCount = 0;
    this.fileName = null;
    this.store.clearImportedLocalidades();
  }

  voltar(): void {
    this.routerService.navigateTo('localidades/view');
  }

  private parseCsv(text: string): CsvParseResult {
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
    if (!lines.length) {
      return { localidades: [], errors: ['Arquivo vazio ou sem linhas válidas.'], rawCount: 0 };
    }

    const headerIndex = lines.findIndex((line) => line.includes('Frame') && line.includes('Latitude'));
    if (headerIndex < 0) {
      return { localidades: [], errors: ['Cabeçalho não encontrado (Frame/Latitude/Longitude).'], rawCount: 0 };
    }

    const header = this.parseCsvLine(lines[headerIndex]).map((item) => this.normalizeHeader(item));
    const idxFrame = header.indexOf('frame');
    const idxLatitude = header.indexOf('latitude');
    const idxLongitude = header.indexOf('longitude');
    const idxStamp = header.indexOf('stamp');

    if (idxFrame < 0 || idxLatitude < 0 || idxLongitude < 0) {
      return { localidades: [], errors: ['Colunas obrigatórias ausentes (Frame, Latitude, Longitude).'], rawCount: 0 };
    }

    const localidades: Localidade[] = [];
    const errors: string[] = [];
    const dataLines = lines.slice(headerIndex + 1);

    dataLines.forEach((line, index) => {
      const row = this.parseCsvLine(line);
      const frame = this.cleanCell(row[idxFrame]);
      const latitudeRaw = this.cleanCell(row[idxLatitude]);
      const longitudeRaw = this.cleanCell(row[idxLongitude]);

      if (!frame) return;

      const latitude = Number.parseFloat(latitudeRaw.replace(',', '.'));
      const longitude = Number.parseFloat(longitudeRaw.replace(',', '.'));

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        errors.push(`Linha ${index + headerIndex + 2}: latitude/longitude inválidas.`);
        return;
      }

      const stamp = idxStamp >= 0 ? this.cleanCell(row[idxStamp]) : '';
      const fileName = `${frame}.jpeg`;

      localidades.push({
        id: String(frame),
        nome: `Frame ${frame}`,
        descricao: stamp || undefined,
        latitude,
        longitude,
        url: `/source/${fileName}`,
      });
    });

    return { localidades, errors, rawCount: dataLines.length };
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
        continue;
      }

      current += char;
    }

    result.push(current);
    return result;
  }

  private cleanCell(value?: string): string {
    return (value ?? '').trim().replace(/^"|"$/g, '');
  }

  private normalizeHeader(value?: string): string {
    return this.cleanCell(value).toLowerCase();
  }
}
