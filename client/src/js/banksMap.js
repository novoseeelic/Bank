import { el } from 'redom';
import { createMap } from './ymaps.js';

export const banksMap = () => {
  const title = el('h2', { class: 'banks__title' }, 'Карта банкоматов'),
    map = el('div', {
      class: 'banks__map',
      id: 'map',
    }),
    container = el('div', { class: 'banks__container container' }, [
      title,
      map,
    ]),
    page = el('section', { class: 'banks' }, [container]);

  createMap(map, [55.75399399999374, 37.62209300000001], 10);

  return {
    page,
  };
};
