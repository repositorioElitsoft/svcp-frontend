import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-shared-table",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatButtonModule, MatIconModule],
  templateUrl: "./shared-table.component.html",
  styleUrls: ["./shared-table.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimización
})
export class SharedTableComponent {
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Output() deleteSelected = new EventEmitter<string[]>();
  @Output() viewSelected = new EventEmitter<string>();
  @Output() editSelected = new EventEmitter<string>();

  // Getter dinámico para evitar problemas con @Input()
  get allColumns(): string[] {
    return ['select', ...this.displayedColumns, 'actions'];
  }

  selection = new SelectionModel<any>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1}`;
  }

  onDelete() {
    const selectedIds = this.selection.selected.map((item) => item.id);
    this.deleteSelected.emit(selectedIds);
  }

  onView(id: string) {
    this.viewSelected.emit(id);
  }

  onEdit(id: string) {
    this.editSelected.emit(id);
  }
}
