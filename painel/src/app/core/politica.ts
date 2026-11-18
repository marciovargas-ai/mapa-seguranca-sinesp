import { normalizar } from './util';

/**
 * Notícia de política fica fora do painel. Política (políticos, eleição, STF, Congresso) fica fora, salvo quando o político é vítima de crime (assalto, roubo, furto, morte, ataque). Corrupção fica sempre fora. Nomes de rua/escola/bairro ("Rua Lula Gomes") não contam.
 * Mesma regra do servidor (ehNoticiaPolitica_ em 2_Motor_OSINT_NLP.gs); mudou uma, mude a outra.
 */
const POLITICA = /\b(lula|bolsonaro|bolsonaros|bolsonarista|bolsonaristas|lulista|lulistas|petista|petistas|janja|alexandre de moraes|presidente da republica|presidente lula|planalto|stf|supremo tribunal|tse|pgr|cpi|cpmi|congresso nacional|camara dos deputados|camara municipal|senado|eleicao|eleicoes|eleitoral|eleitorais|candidato|candidata|campanha eleitoral|golpe de estado|trama golpista|tentativa de golpe|8 de janeiro|impeachment|emendas? parlamentar(es)?|deputad[oa]s?|senador(a|es|as)?|vereador(a|es|as)?|prefeit[oa]s?|vice prefeit[oa]|governador(a|es|as)?|ministr[oa]s?|parlamentar(es)?|secretari[oa] de estado)\b/;
const CORRUPCAO = /\b(corrupcao|propina|desvio de verbas?|desvio de recursos|improbidade|peculato|rachadinha|licitacao|mensalao|petrolao|lavagem de dinheiro publico)\b/;
const VITIMA = /\b(assaltad[oa]s?|assalto|assaltantes|roubad[oa]s?|roubo|furtad[oa]s?|furto|arrombad[oa]s?|arrombamento|latrocinio|assassinad[oa]s?|mort[oa]s?|morte|executad[oa]s?|baleado|baleada|atentado|alvejad[oa]s?|sequestrad[oa]s?|sequestro|esfaquead[oa]s?|homicidio|agredid[oa]s?|tiros)\b/;
const LOGRADOURO = /\b(rua|avenida|av|travessa|praca|estrada|rodovia|alameda|viaduto|escola|colegio|bairro|vila|jardim|conjunto)( [a-z0-9]+){1,3}/g;

export function ehNoticiaPolitica(titulo: unknown): boolean {
  const t = ' ' + normalizar(titulo).replace(LOGRADOURO, ' ') + ' ';
  return CORRUPCAO.test(t) || (POLITICA.test(t) && !VITIMA.test(t));
}
