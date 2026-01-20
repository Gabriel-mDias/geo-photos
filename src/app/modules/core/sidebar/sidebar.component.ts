import { Component, HostListener, OnInit } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';
import { MENUS_ITENS } from '../config/menu.config';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  private readonly compactWidth = 900;
  isCompact: boolean = false;

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

  ngOnInit(): void {
    this._syncLayout(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const width = (event.target as Window)?.innerWidth ?? window.innerWidth;
    this._syncLayout(width);
  }

  toggleExpanded(): void {
    if (this.isCompact) return;
    this.expanded = !this.expanded;
  }

  clickMenu(item: MenuItem) {
    this.routerService.navigateTo(item.redirectTo);
  }

  private _syncLayout(width: number): void {
    this.isCompact = width <= this.compactWidth;
    if (this.isCompact) {
      this.expanded = true;
    }
  }
}
