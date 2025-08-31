import { Component } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';
import { MENUS_ITENS } from '../config/menu.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  get itens(): MenuItem[] {
    if( !MENUS_ITENS ){
      return []
    }

    return MENUS_ITENS
  }

  clickMenu(item: MenuItem) {
    console.log('Menu item clicked:', item);
  }

}
