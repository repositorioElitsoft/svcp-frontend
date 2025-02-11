import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expansion-panel',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.css'
})
export class ExpansionPanelComponent {
  @ViewChild('content') content!: ElementRef;
  @Input() isShrinked = false;
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

  private toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.calculateHeight();
  }

  private calculateHeight() {
    setTimeout(() => {
      this.contentHeight = this.isExpanded && !this.isShrinked ?
        this.content.nativeElement.scrollHeight : 0;
    });
  }

}
