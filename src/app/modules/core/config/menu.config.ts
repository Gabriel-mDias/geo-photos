import { MenuItem } from "../models/menu-item.model";
import { faUser, faGear, faPen, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';


/**
 * Definição dos menus e de seus caminhos de redirecionamento
 */
export const MENUS_ITENS: MenuItem[] = [
    {
        label: 'Localidades',
        icon: faMapLocationDot,
        tooltip: 'Lista de todas as localidades cadastradas no sistema',
        redirectTo: 'localidades/view'
    },
    {
        label: 'Usuários',
        icon: faUser,
        tooltip: 'Textinho descritivo sobre os usuários',
        redirectTo: 'page'
    },
    {
        label: 'Configurações',
        icon: faGear,
        tooltip: 'Textinho descritivo sobre os usuários',
        redirectTo: 'page'
    },
]