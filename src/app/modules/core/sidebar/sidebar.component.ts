import { Component } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';
import { MENUS_ITENS } from '../config/menu.config';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  expanded: boolean = false;

  get itens(): MenuItem[] {
    if( !MENUS_ITENS ){
      return []
    }

    return MENUS_ITENS
  }

  get iconArrow(): any {
    return this.expanded ? faAngleLeft : faAngleRight;
  }

  constructor(
    private routerService: RouterService
  ){}

  clickMenu(item: MenuItem) {
    this.routerService.navigateTo(item.redirectTo);
  }

}
