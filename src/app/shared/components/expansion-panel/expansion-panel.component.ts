import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-expansion-panel',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.css'
})
export class ExpansionPanelComponent {
  @ViewChild('content') content!: ElementRef;
  @Input() isShrinked = false;
  @Input() icon = "";
  @Input() title = "";
  @Output() onShrinkClick = new EventEmitter<void>();

  @Input() isExpanded = false;
  contentHeight = 0;

  ngAfterViewInit() {
    this.calculateHeight();
  }

  ngOnChanges() {
    // When shrinked state changes, ensure panel is closed
    if (this.isShrinked) {
      this.isExpanded = false;
      this.calculateHeight();
    }
  }

  handleClick() {
    if (this.isShrinked) {
      this.onShrinkClick.emit();
    } else {
      this.toggleExpand();
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.calculateHeight();
  }

  shrink() {
    this.isExpanded = false;
    this.calculateHeight();
  }

  private calculateHeight() {
    setTimeout(() => {
      this.contentHeight = this.isExpanded && !this.isShrinked ?
        this.content.nativeElement.scrollHeight : 0;
    });
  }

}
