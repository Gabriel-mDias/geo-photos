import { MenuItem } from "../models/menu-item.model";
import { faUser, faGear, faMapLocationDot, faFileArrowUp, faHouse } from '@fortawesome/free-solid-svg-icons';


/**
 * Definição dos menus e de seus caminhos de redirecionamento
 */
export const MENUS_ITENS: MenuItem[] = [
    {
        label: 'Início',
        icon: faHouse,
        tooltip: 'Visão geral do sistema',
        redirectTo: 'inicio'
    },
    {
        label: 'Localidades',
        icon: faMapLocationDot,
        tooltip: 'Lista de todas as localidades cadastradas no sistema',
        redirectTo: 'localidades/view'
    },
    {
        label: 'Importar CSV',
        icon: faFileArrowUp,
        tooltip: 'Importar localidades a partir do CSV de metadata',
        redirectTo: 'localidades/importar'
    },
    {
        label: 'Usuários',
        icon: faUser,
        tooltip: 'Textinho descritivo sobre os usuários',
        redirectTo: 'administracao/usuarios'
    },
    {
        label: 'Configurações',
        icon: faGear,
        tooltip: 'Textinho descritivo sobre os usuários',
        redirectTo: 'administracao/configuracoes'
    },
]
