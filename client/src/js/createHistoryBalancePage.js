import { el } from 'redom';
import {
  createDynamicBalance,
  createHistoryTranslations,
  formatThousand,
  transToLink,
} from './utils';

export const createHistoryBalancePage = (data) => {
  const blockDynamicBalance = createDynamicBalance(
    'Динамика баланса',
    'history',
    'history',
  );
  const blockRatioBalance = createDynamicBalance(
    'Соотношение входящих исходящих транзакций',
    'ratio',
    'ratio',
  );
  const blockStoryTranslations = createHistoryTranslations(
    data,
    -25,
    'history-story',
  );

  const title = el(
      'h1',
      { class: 'history-page__title title' },
      'История баланса',
    ),
    backBtn = el(
      'a',
      {
        class: 'history-page__back-btn btn btn-reset',
        href: `/${data.account}`,
      },
      'Вернуться назад',
    ),
    headWrap = el('div', { class: 'history-page__head-wrap' }, [
      title,
      backBtn,
    ]),
    accountNumber = el(
      'h2',
      { class: 'history-page__number title' },
      `№ ${data.account}`,
    ),
    balanceTitle = el(
      'span',
      { class: 'history-page__balance-title' },
      'Баланс',
    ),
    balanceCheck = el(
      'span',
      { class: 'history-page__balance-check' },
      `${formatThousand(data.balance)} ₽`,
    ),
    balanceWrap = el('div', { class: 'history-page__balance-wrap' }, [
      balanceTitle,
      balanceCheck,
    ]),
    accountWrap = el('div', { class: 'history-page__acc-wrap' }, [
      accountNumber,
      balanceWrap,
    ]),
    actionWrap = el('div', { class: 'history-page__translations' }, [
      blockDynamicBalance.dynamicBalance,
      blockRatioBalance.dynamicBalance,
      blockStoryTranslations.storyTranslations,
    ]),
    container = el('div', { class: 'history-page__container container' }, [
      headWrap,
      accountWrap,
      actionWrap,
    ]),
    pageContainer = el('section', { class: 'history-page' }, [container]);

  backBtn.addEventListener('click', (event) => {
    transToLink(event, 'href');
  });

  const currentDate = new Date();
  const MonthsAgo = new Date();
  MonthsAgo.setMonth(currentDate.getMonth() - 11);
  const formatterMonthAgo = MonthsAgo.toISOString();

  const transArr = [];
  const monthArr = [];
  const balanceArr = [];
  const transactionsHistory = [];
  const positiveTransArr = [];
  const negativeTransArr = [];

  data.transactions.forEach((response) => {
    const month = new Date(response.date);
    const monthsCorrect = month.toLocaleString('ru-RU', {
      month: 'long',
    });

    if (response.date >= formatterMonthAgo) {
      transArr.push(response.amount);

      for (let i = 0; i < transArr.length; i++) {
        const oldBalance = data.balance - response.amount;
        balanceArr.push(oldBalance);
      }
      monthArr.push(monthsCorrect);

      if (response.to !== data.account) {
        negativeTransArr.push(response.amount);
      } else {
        positiveTransArr.push(response.amount);
      }
    }
  });

  transactionsHistory.push(...positiveTransArr, ...negativeTransArr);

  const correctMonthArr = new Set(monthArr);
  const newcorrectMonthArr = Array.from(correctMonthArr);

  const correctBalanceArr = new Set(balanceArr);
  const newcorrectBalanceArr = Array.from(correctBalanceArr);

  return {
    pageContainer,
    newcorrectMonthArr,
    newcorrectBalanceArr,
    positiveTransArr,
    transactionsHistory,
    negativeTransArr,
  };
};
