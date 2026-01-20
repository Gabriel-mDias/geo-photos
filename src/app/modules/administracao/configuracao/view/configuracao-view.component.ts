import { Component } from '@angular/core';

type ConfigItem = {
  titulo: string;
  descricao: string;
  status: string;
};

@Component({
  selector: 'app-configuracao-view',
  templateUrl: './configuracao-view.component.html',
  styleUrl: './configuracao-view.component.scss'
})
export class ConfiguracaoViewComponent {
  ambientes = [
    { label: 'Nome do ambiente', value: 'Geo-Photos | Producao' },
    { label: 'Regiao de dados', value: 'South America (sa-east-1)' },
    { label: 'Idioma padrao', value: 'Portugues (BR)' },
    { label: 'Formato de data', value: 'DD/MM/AAAA' },
  ];

  integracoes: ConfigItem[] = [
    {
      titulo: 'API de mapas',
      descricao: 'Token atualizado ha 12 dias',
      status: 'Ativa'
    },
    {
      titulo: 'Armazenamento de imagens',
      descricao: '512 GB usados de 2 TB',
      status: 'Saudavel'
    },
    {
      titulo: 'Webhook de alertas',
      descricao: 'Enviando para Slack',
      status: 'Ativo'
    }
  ];

  seguranca = [
    { label: '2FA obrigatorio', value: 'Ativo' },
    { label: 'Tempo de sessao', value: '8 horas' },
    { label: 'Politica de senha', value: '12 caracteres + simbolo' }
  ];

  notificacoes = [
    { label: 'Fotos 360 processadas', value: 'Email + Dashboard' },
    { label: 'Falha de upload', value: 'Email imediato' },
    { label: 'Relatorio semanal', value: 'Segundas 08:00' }
  ];
}
