import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
  selector: "app-buttom-small",
  templateUrl: "./buttom-small.component.html",
  styleUrls: ["./buttom-small.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtomSmallComponent {
  @Input() iconsLeft: boolean = false;
  @Input() iconsRigt: boolean = false;
  @Input() property1 = "Default";
}
