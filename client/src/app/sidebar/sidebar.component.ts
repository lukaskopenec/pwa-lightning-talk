import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() visible = false;
  @Output() sidebarClose: EventEmitter<void> = new EventEmitter();

  onClick(): void {
    this.sidebarClose.emit();
  }
}
