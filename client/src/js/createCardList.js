import { el } from 'redom';
import { formatDate, formatThousand, transToLink } from './utils';

export const createCardList = (data, list) => {
  const title = el('h2', { class: 'list__card-title' }, data.account);
  const resources = el(
    'span',
    { class: 'list__card-money' },
    `${formatThousand(data.balance)} ₽`,
  );
  const transact = data.transactions.map((res) => {
    return res;
  });
  const lastTransactionsTitle = el(
    'h3',
    { class: 'list__transactions-title' },
    'Последняя транзакция:',
  );
  const lastTransactionsDate = el('time', { class: 'list__transactions-date' });
  const detailLink = el(
    'a',
    { class: 'list__btn btn btn-reset', href: `/${data.account}` },
    'Открыть',
  );
  const lastTransactionsWrap = el('div', { class: 'list__transactions-wrap' }, [
    lastTransactionsTitle,
    lastTransactionsDate,
  ]);
  const transactionsWrap = el('div', { class: 'list__wrap' }, [
    lastTransactionsWrap,
    detailLink,
  ]);
  const card = el('li', { class: 'list__card-pay' }, [
    title,
    resources,
    transactionsWrap,
  ]);

  detailLink.addEventListener('click', (event) => {
    const navAcc = document.querySelector('.header__btn-accounts');
    navAcc.classList.remove('disabled');
    transToLink(event, 'href');
  });

  if (transact.length !== 0) {
    lastTransactionsDate.textContent = formatDate(transact[0].date);
  } else {
    lastTransactionsDate.textContent = 'Нет данных';
  }

  list.append(card);
};
