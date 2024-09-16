import { el } from 'redom';
import { createAccount, getAccounts } from './api.js';
import { createCardList } from './createCardList.js';

export const personal = async () => {
  let token = localStorage.getItem('token');
  const headerNavigate = document.querySelector('.header__navigate');
  headerNavigate.style.display = 'flex';

  const title = el('h1', { className: 'personal__title' }, 'Ваши счета'),
    selected = el('span', { class: 'personal__selected' }, 'Сортировка'),
    caret = el('div', { class: 'personal__caret' }),
    select = el('div', { class: 'personal__select' }, [selected, caret]),
    listItem = el('li', { class: 'personal__menu-item active' }, 'Сортировка'),
    listItemNumb = el(
      'li',
      { class: 'personal__menu-item number-sort' },
      'По номеру',
    ),
    listItemBalance = el(
      'li',
      { class: 'personal__menu-item balance-sort' },
      'По балансу',
    ),
    listItemTrans = el(
      'li',
      { class: 'personal__menu-item trans-sort' },
      'По последней транзакции',
    ),
    list = el('ul', { class: 'personal__menu' }, [
      listItemNumb,
      listItemBalance,
      listItemTrans,
    ]),
    dropdown = el('div', { class: 'personal__dropdown' }, [select, list]),
    btnnewAccSpan = el('span', { class: 'personal__btn-span' }),
    btnNewAcc = el(
      'button',
      { className: 'personal__btn btn btn-reset' },
      [btnnewAccSpan],
      'Создать новый счёт',
    ),
    sortWrap = el('div', { className: 'personal__sort-wrap' }, [
      title,
      dropdown,
    ]),
    actionWrap = el('div', { className: 'personal__action-wrap' }, [
      sortWrap,
      btnNewAcc,
    ]),
    sectionPay = el('ul', { class: 'personal__pay-list list list-reset' }),
    container = el('div', { class: 'personal__container container' }, [
      actionWrap,
      sectionPay,
    ]);

  await getAccounts(token).then((res) => {
    const arr = res.payload.map((res) => {
      return res;
    });

    for (const pay of arr) {
      createCardList(pay, sectionPay);
    }
  });

  btnNewAcc.addEventListener('click', async () => {
    createAccount(token);
    await getAccounts(token).then((res) => {
      const newArr = res.payload.map((res) => {
        return res;
      });

      sectionPay.innerHTML = '';

      for (const pay of newArr) {
        createCardList(pay, sectionPay);
      }
    });
  });

  return {
    container,
    sectionPay,
  };
};
