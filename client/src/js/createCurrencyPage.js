import { el } from 'redom';
import {
  createAvailableCurrencies,
  createChangingRates,
  createExchangeCurrency,
} from './utils.js';

export const createCurrencyPage = (data) => {
  const availableCurrencies = createAvailableCurrencies(data);
  const exchangeCurrency = createExchangeCurrency();
  const changingRates = createChangingRates();

  const title = el('h2', { class: 'currency__title' }, 'Валютный обмен'),
    wrapBlocks = el('div', { class: 'currency__wrap-blocks' }, [
      availableCurrencies.availableCurrenciesBlock,
      exchangeCurrency.exchangeBlock,
    ]),
    wrapChanges = el('div', { class: 'currency__wrap-changes' }, [
      changingRates.changingBlock,
    ]),
    wrapperCurrency = el('div', { class: 'currency__wrapper' }, [
      wrapBlocks,
      wrapChanges,
    ]),
    container = el('div', { class: 'container' }, [title, wrapperCurrency]),
    section = el('section', { class: 'currency' }, [container]);

  return section;
};
