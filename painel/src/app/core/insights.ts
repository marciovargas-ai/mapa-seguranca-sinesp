import { CATEGORIA_POR_ID, ORGAO_POR_ID } from './dados';
import { Filtrados, Insight, Oficial, Panorama } from './modelos';
import { DIAS_SEMANA, fmt, fmt1, normalizar, pct, rotuloPeriodo, variacao } from './util';

const DIAS_EXTENSO = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const minusc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const ordinal = (n: number) => n + 'º';

interface Contexto {
  ehEstado: boolean;
  nomeLocal: string;
  cidade: string;
  oficial: Oficial | null;
  panorama: Panorama | null;
  f: Filtrados;
  periodoDias: number;
}

/**
 * Insights por regras: comparações que um analista faria primeiro.
 * Estatística oficial (Sinesp) vem antes das notícias.
 */
export function gerarInsights(c: Contexto): Insight[] {
  const oficiais: Insight[] = [];
  const noticias: Insight[] = [];
  const o = c.oficial && c.oficial.disponivel ? c.oficial : null;

  if (o && o.eventos.length && o.anos) {
    const [a0, a1, a2] = o.anos;
    const ult = o.ultimoMes || 'dez';
    const parcial = ult !== 'dez';

    // Ano corrente × mesmo período do ano anterior (os indicadores com maior variação)
    const variacoes = o.eventos
      .map((e) => ({ e, v: variacao(e.porAno[2], e.parcialAnterior) }))
      .filter((x) => x.v !== null && Math.abs(x.v) >= 10 && Math.max(x.e.porAno[2] || 0, x.e.parcialAnterior || 0) >= 10);
    variacoes.slice(0, 3).forEach(({ e, v }) => {
      const sobe = v! > 0;
      oficiais.push({
        icone: sobe ? 'trending_up' : 'trending_down', tom: sobe ? 'alerta' : 'positivo', fonte: 'Sinesp',
        titulo: `${e.nome}: ${sobe ? '+' : ''}${v}% em ${a2}`,
        texto: `${fmt(e.porAno[2])} registros de jan a ${ult}/${a2}, contra ${fmt(e.parcialAnterior)} no mesmo período de ${a1}.`,
      });
    });

    // Último mês publicado bem acima ou abaixo da média dos 11 anteriores
    const principal = o.eventos[0];
    if (principal.serie.length === 12) {
      const ultimoMes = principal.serie[11];
      const media = principal.serie.slice(0, 11).reduce((a, b) => a + b, 0) / 11;
      if (media >= 5 && (ultimoMes > media * 1.3 || ultimoMes < media * 0.7)) {
        const acima = ultimoMes > media;
        oficiais.push({
          icone: acima ? 'warning' : 'check_circle', tom: acima ? 'alerta' : 'positivo', fonte: 'Sinesp',
          titulo: `${o.meses?.[11] || ult}: mês ${acima ? 'acima' : 'abaixo'} da média`,
          texto: `${principal.nome}: ${fmt(ultimoMes)} no último mês publicado, contra média de ${fmt(Math.round(media))} por mês no ano anterior.`,
        });
      }
    }

    // Taxa do município comparada à do estado
    if (!c.ehEstado) {
      const comTaxa = o.eventos.filter((e) => e.taxa != null && e.taxaEstado && e.total >= 5);
      const destaque = comTaxa
        .map((e) => ({ e, r: e.taxa! / e.taxaEstado! }))
        .filter((x) => x.r >= 1.25 || x.r <= 0.75)
        .sort((x, y) => Math.abs(Math.log(y.r)) - Math.abs(Math.log(x.r)))[0];
      if (destaque) {
        const acima = destaque.r > 1;
        oficiais.push({
          icone: acima ? 'priority_high' : 'verified', tom: acima ? 'alerta' : 'positivo', fonte: 'Sinesp + IBGE',
          titulo: acima ? `${fmt1(destaque.r)}× a taxa do estado` : `Taxa ${pct(1 - destaque.r, 1)}% menor que a do estado`,
          texto: `${destaque.e.nome}: ${fmt1(destaque.e.taxa)} por 100 mil habitantes em ${c.cidade}, contra ${fmt1(destaque.e.taxaEstado)} no estado (12 meses).`,
        });
      }
    }

    // Posição do município no ranking do estado
    if (!c.ehEstado && c.panorama?.rankings?.length) {
      const alvo = normalizar(c.cidade);
      for (const r of c.panorama.rankings.slice(0, 3)) {
        const posTotal = r.porTotal.findIndex((l) => normalizar(l.n) === alvo);
        const posTaxa = r.porTaxa.findIndex((l) => normalizar(l.n) === alvo);
        if (posTotal >= 0 && posTotal < 10) {
          oficiais.push({
            icone: 'leaderboard', tom: posTotal < 3 ? 'alerta' : 'neutro', fonte: 'Sinesp',
            titulo: `${ordinal(posTotal + 1)} do estado em ${minusc(r.evento)}`,
            texto: `Entre ${fmt(r.municipiosComRegistro)} municípios com registro nos últimos 12 meses` +
              (posTaxa >= 0 ? `; ${ordinal(posTaxa + 1)} na taxa por 100 mil habitantes.` : '.'),
          });
          break;
        }
      }
    }

    // Ano fechado × ano anterior
    if (principal.porAno[0] && principal.porAno[1] != null) {
      const v = variacao(principal.porAno[1], principal.porAno[0]);
      if (v !== null && Math.abs(v) >= 5) {
        oficiais.push({
          icone: 'calendar_month', tom: v > 0 ? 'alerta' : 'positivo', fonte: 'Sinesp',
          titulo: `${a1} fechou ${v > 0 ? 'acima' : 'abaixo'} de ${a0}`,
          texto: `${principal.nome}: ${fmt(principal.porAno[1])} em ${a1} contra ${fmt(principal.porAno[0])} em ${a0} (${v > 0 ? '+' : ''}${v}%).` +
            (parcial ? ` ${a2} tem dados até ${ult}.` : ''),
        });
      }
    }

    // Peso dos registros federais (rodovias e crimes federais)
    const fed = o.eventos
      .map((e) => ({ e, s: e.federais ? Object.values(e.federais).reduce((a, b) => a + b, 0) : 0 }))
      .filter((x) => x.e.total >= 10 && x.s / x.e.total >= 0.15)
      .sort((x, y) => y.s / y.e.total - x.s / x.e.total)[0];
    if (fed) {
      const orgs = Object.keys(fed.e.federais!).map((k) => ORGAO_POR_ID[k]?.curto || k).join(' e ');
      oficiais.push({
        icone: 'local_police', tom: 'neutro', fonte: 'Sinesp',
        titulo: `${pct(fed.s, fed.e.total)}% registrados por ${orgs}`,
        texto: `${fed.e.nome}: ${fmt(fed.s)} de ${fmt(fed.e.total)} registros dos últimos 12 meses vieram de órgãos federais.`,
      });
    }
  }

  // Panorama do estado: concentração, maior alta e maior taxa
  if (c.ehEstado && c.panorama?.rankings?.length) {
    const r = c.panorama.rankings[0];
    const totalEstado = o?.eventos.find((e) => e.nome === r.evento)?.total || 0;
    const top5 = r.porTotal.slice(0, 5).reduce((a, l) => a + l.total, 0);
    if (totalEstado > 0 && r.porTotal.length >= 5) {
      oficiais.push({
        icone: 'donut_large', tom: 'neutro', fonte: 'Sinesp',
        titulo: `${pct(top5, totalEstado)}% em 5 municípios`,
        texto: `${r.evento}: ${r.porTotal.slice(0, 5).map((l) => l.n).join(', ')} somam ${fmt(top5)} de ${fmt(totalEstado)} registros do estado.`,
      });
    }
    const alta = r.altas[0];
    if (alta && alta.total - alta.anterior >= 5) {
      oficiais.push({
        icone: 'north_east', tom: 'alerta', fonte: 'Sinesp',
        titulo: `Maior alta: ${alta.n}`,
        texto: `${r.evento}: ${fmt(alta.total)} nos últimos 12 meses, ${fmt(alta.total - alta.anterior)} a mais que nos 12 anteriores.`,
      });
    }
    const taxa = r.porTaxa[0];
    if (taxa) {
      oficiais.push({
        icone: 'percent', tom: 'alerta', fonte: 'Sinesp + IBGE',
        titulo: `Maior taxa: ${taxa.n}`,
        texto: `${r.evento}: ${fmt1(taxa.taxa)} por 100 mil habitantes (municípios com 20 mil habitantes ou mais).`,
      });
    }
  }

  // Notícias
  const f = c.f;
  const total = f.todas.length;
  const p = rotuloPeriodo(c.periodoDias);
  if (f.comparavel && total + f.anteriores.length >= 8) {
    const v = variacao(total, f.anteriores.length);
    if (v !== null && Math.abs(v) >= 15) {
      noticias.push({
        icone: v > 0 ? 'campaign' : 'south_east', tom: v > 0 ? 'alerta' : 'positivo', fonte: 'Notícias',
        titulo: `Noticiário ${v > 0 ? 'em alta' : 'em queda'}: ${v > 0 ? '+' : ''}${v}%`,
        texto: `${fmt(total)} ocorrências noticiadas nos últimos ${p}, contra ${fmt(f.anteriores.length)} nos ${p} anteriores.`,
      });
    }
  }
  const z = f.zonas[0];
  if (z) {
    noticias.push({
      icone: 'crisis_alert', tom: 'alerta', fonte: 'Notícias',
      titulo: `Zona mais crítica: ${z.nome.split(',')[0]}`,
      texto: `${fmt(z.qtd)} ocorrências${z.graves ? `, ${fmt(z.graves)} com homicídio ou tiroteio` : ''}` +
        (z.recentes > z.anteriores30 ? '; em alta nos últimos 30 dias.' : '.'),
    });
  }
  if (total >= 14) {
    const max = Math.max(...f.semana);
    const media = total / 7;
    if (max >= media * 1.5) {
      const dia = f.semana.indexOf(max);
      noticias.push({
        icone: 'event', tom: 'neutro', fonte: 'Notícias',
        titulo: `Pico às ${DIAS_SEMANA[dia].toLowerCase()}s`,
        texto: `${pct(max, total)}% das ocorrências noticiadas caíram numa ${DIAS_EXTENSO[dia]}.`,
      });
    }
  }
  const cats = Object.keys(f.porCat).sort((a, b) => f.porCat[b] - f.porCat[a]);
  if (total >= 10 && cats.length) {
    const cat = CATEGORIA_POR_ID[cats[0]];
    noticias.push({
      icone: 'category', tom: 'neutro', fonte: 'Notícias',
      titulo: `Predomínio de ${cat.curto.toLowerCase()}`,
      texto: `${pct(f.porCat[cat.id], total)}% das notícias dos últimos ${p} tratam de ${cat.nome.toLowerCase()}.`,
    });
  }
  const orgaoTop = Object.keys(f.porOrgao).sort((a, b) => f.porOrgao[b].qtd - f.porOrgao[a].qtd)[0];
  if (orgaoTop && f.totalCruzamento >= 10) {
    noticias.push({
      icone: 'hub', tom: 'neutro', fonte: 'Notícias',
      titulo: `${ORGAO_POR_ID[orgaoTop].nome} é a fonte mais citada`,
      texto: `Aparece em ${pct(f.porOrgao[orgaoTop].qtd, f.totalCruzamento)}% das notícias; ${pct(f.imprensaLocal, f.totalCruzamento)}% vieram da imprensa local.`,
    });
  }

  return [...oficiais.slice(0, 6), ...noticias.slice(0, 4)];
}

