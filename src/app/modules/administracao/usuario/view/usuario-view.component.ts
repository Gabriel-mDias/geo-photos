import { Component } from '@angular/core';

type UsuarioMock = {
  nome: string;
  email: string;
  perfil: string;
  status: 'Ativo' | 'Pendente' | 'Bloqueado';
  ultimoAcesso: string;
};

@Component({
  selector: 'app-usuario-view',
  templateUrl: './usuario-view.component.html',
  styleUrl: './usuario-view.component.scss'
})
export class UsuarioViewComponent {
  resumo = [
    { label: 'Total de usuarios', valor: '24', detalhe: 'Inclui contas desativadas' },
    { label: 'Ativos', valor: '18', detalhe: 'Ultimos 7 dias' },
    { label: 'Pendentes', valor: '3', detalhe: 'Convites enviados' },
    { label: 'Bloqueados', valor: '3', detalhe: 'Revisao necessaria' },
  ];

  usuarios: UsuarioMock[] = [
    {
      nome: 'Ana Lima',
      email: 'ana.lima@geophotos.com',
      perfil: 'Administradora',
      status: 'Ativo',
      ultimoAcesso: 'Hoje 09:12'
    },
    {
      nome: 'Bruno Castro',
      email: 'b.castro@geophotos.com',
      perfil: 'Operador',
      status: 'Pendente',
      ultimoAcesso: 'Convite enviado'
    },
    {
      nome: 'Carla Nunes',
      email: 'carla.nunes@geophotos.com',
      perfil: 'Analista',
      status: 'Ativo',
      ultimoAcesso: 'Ontem 18:40'
    },
    {
      nome: 'Diego Barros',
      email: 'd.barros@geophotos.com',
      perfil: 'Operador',
      status: 'Bloqueado',
      ultimoAcesso: '04/08 10:21'
    },
    {
      nome: 'Elisa Moura',
      email: 'elisa.moura@geophotos.com',
      perfil: 'Visualizador',
      status: 'Ativo',
      ultimoAcesso: '03/08 16:05'
    }
  ];

  perfis = [
    {
      titulo: 'Administracao',
      descricao: 'Controle total de usuarios, mapas e configuracoes.'
    },
    {
      titulo: 'Operacao',
      descricao: 'Cadastro de localidades e revisao de fotos 360.'
    },
    {
      titulo: 'Visualizacao',
      descricao: 'Acesso somente leitura aos mapas e relatorios.'
    }
  ];
}
