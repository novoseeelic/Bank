import {
  createDynamicBalance,
  createHistoryTranslations,
  createNewTranslation,
  formatThousand,
  transToLink,
} from './utils';
import { el } from 'redom';

export const createDetailPage = (data) => {
  localStorage.setItem('id', data.account);
  const blockNewTranslation = createNewTranslation(data);
  const blockStoryTranslations = createHistoryTranslations(data, -10, 'story');
  const blockDynamicBalance = createDynamicBalance(
    'Динамика баланса',
    'dynamic',
    'dynamic',
  );

  const title = el('h1', { class: 'account__title title' }, 'Просмотр счёта'),
    backBtn = el(
      'a',
      { class: 'account__back-btn btn btn-reset', href: '/account' },
      'Вернуться назад',
    ),
    headWrap = el('div', { class: 'account__head-wrap' }, [title, backBtn]),
    accountNumber = el(
      'h2',
      { class: 'account__number title' },
      `№ ${data.account}`,
    ),
    balanceTitle = el('span', { class: 'account__balance-title' }, 'Баланс'),
    balanceCheck = el(
      'span',
      { class: 'account__balance-check' },
      `${formatThousand(data.balance)} ₽`,
    ),
    balanceWrap = el('div', { class: 'account__balance-wrap' }, [
      balanceTitle,
      balanceCheck,
    ]),
    accountWrap = el('div', { class: 'account__acc-wrap' }, [
      accountNumber,
      balanceWrap,
    ]),
    actionWrap = el('div', { class: 'account__translations' }, [
      blockNewTranslation.newTranslation,
      blockDynamicBalance.dynamicBalance,
      blockStoryTranslations.storyTranslations,
    ]),
    container = el('div', { class: 'account__container container' }, [
      headWrap,
      accountWrap,
      actionWrap,
    ]),
    pageContainer = el('section', { class: 'account' }, [container]);

  backBtn.addEventListener('click', (event) => {
    const navAcc = document.querySelector('.header__btn-accounts');
    navAcc.classList.add('disabled');
    transToLink(event, 'href');
  });

  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
  const formattersixMonthAgo = sixMonthsAgo.toISOString();

  const transArr = [];
  const monthArr = [];
  const balanceArr = [];

  data.transactions.forEach((response) => {
    const month = new Date(response.date);
    const monthsCorrect = month.toLocaleString('ru-RU', {
      month: 'long',
    });

    if (response.date >= formattersixMonthAgo) {
      transArr.push(response.amount);

      for (let i = 0; i < transArr.length; i++) {
        const oldBalance = data.balance - response.amount;
        balanceArr.push(oldBalance);
      }
      monthArr.push(monthsCorrect);
    }
  });
  const correctMonthArr = new Set(monthArr);
  const newcorrectMonthArr = Array.from(correctMonthArr);

  const correctBalanceArr = new Set(balanceArr);
  const newcorrectBalanceArr = Array.from(correctBalanceArr);

  return {
    pageContainer,
    backBtn,
    newcorrectMonthArr,
    newcorrectBalanceArr,
    balanceCheck,
  };
};
