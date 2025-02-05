import { trigger, state, style, transition, animate } from '@angular/animations';

export function BasicAnimations() {
    return [
        trigger('sidebarAnimation', [
            state('open', style({
                transform: 'translateX(0)'
            })),
            state('closed', style({
                transform: 'translateX(-120%)'
            })),
            transition('open <=> closed', [
                animate('0.4s ease-out')
            ])
        ]),
        trigger('fadeAnimation', [
            state('visible', style({
                opacity: 0.5,
                pointerEvents: "auto"
            })),
            state('hidden', style({
                opacity: 0,
                pointerEvents: 'none'
            })),
            transition('visible <=> hidden', [
                animate('0.2s ease-out')
            ])
        ])
    ]
}