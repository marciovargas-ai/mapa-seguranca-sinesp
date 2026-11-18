import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Uma cópia só: se a CDN e a reserva do Apps Script chegarem as duas, a segunda não sobe outro painel
const w = window as any;
if (!w.__PAINEL_INICIADO) {
  w.__PAINEL_INICIADO = true;
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}
