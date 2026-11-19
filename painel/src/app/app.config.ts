import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // No celular, os gestos de toque das dicas (padrão 'auto') travavam a rolagem quando o dedo começava num cartão com dica.
    // Com 'off', a dica abre com toque longo pelo navegador e a rolagem segue livre.
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { showDelay: 0, hideDelay: 0, touchendHideDelay: 1500, touchGestures: 'off' } },
  ],
};
