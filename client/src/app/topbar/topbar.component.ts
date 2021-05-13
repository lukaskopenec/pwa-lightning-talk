import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Input() sidebarVisible = false;
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
