import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {


  updateHue(event: Event) {
    const input = event.target as HTMLInputElement;
    const hex = input.value; // e.g. "#ff5733"
    const { h, s } = this.hexToHSL(hex); // Extract the hue value
    // Update the CSS variable --background-h with the
    const sPer = s * 100;
    console.log(`h ${h}, s ${s}%`)

    document.documentElement.style.setProperty('--main-h', h.toString());
    document.documentElement.style.setProperty('--main-s', sPer.toString() + "%");
  }









  // Utility: Convert hex color to HSL
  hexToHSL(hex: string): { h: number; s: number; l: number } {
    // Remove '#' if present
    hex = hex.replace(/^#/, '');
    // Support shorthand (e.g. "f00")
    if (hex.length === 3) {
      hex = hex.split('').map((x) => x + x).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h *= 60;
    }
    return { h, s, l };
  }
}
