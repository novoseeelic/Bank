import { createLoginPage } from './login.js';
import { el, setChildren } from 'redom';
import { personal } from './personal.js';
import { createHeader } from './header.js';
import { banksMap } from './banksMap.js';
import { createDetailPage } from './createDetailPage.js';
import { getAccount, getAccountCurrencies } from './api.js';

import {
  configSelect,
  createBarChart,
  createBarChartRatio,
  createPreloader,
  sortCardListAccNumber,
  sortCardListBalance,
  sortCardListLastTransaction,
  transitionToHistory,
} from './utils.js';
import { createCurrencyPage } from './createCurrencyPage.js';

import Navigo from 'navigo';
import '../scss/style.scss';
import { createHistoryBalancePage } from './createHistoryBalancePage.js';

export const router = new Navigo('/');
const header = createHeader();
const loader = createPreloader();
const app = el('div', { class: 'app', id: 'app' });

const bankApp = () => {
  try {
    const loginPage = createLoginPage();

    return loginPage.loginSection;
  } catch (error) {
    console.log(error);
  }
};

document.body.append(header, app);

router.on('/', () => {
  app.innerHTML = '';
  app.append(bankApp());
});

router.on('/banks', () => {
  app.innerHTML = '';
  setChildren(app, loader);
  const banksPage = banksMap().page;
  setChildren(app, banksPage);
});

router.on('/currency', () => {
  let token = localStorage.getItem('token');
  app.innerHTML = '';
  getAccountCurrencies(token).then((responce) => {
    const currencyPage = createCurrencyPage(responce.payload);
    setChildren(app, currencyPage);
  });
});

router.on('/history-balance', () => {
  let accountId = localStorage.getItem('id');
  let token = localStorage.getItem('token');
  app.innerHTML = '';
  setChildren(app, loader);
  getAccount(accountId, token).then((responce) => {
    const historyPage = createHistoryBalancePage(responce.payload);
    setChildren(app, historyPage.pageContainer);
    createBarChart(
      'history',
      historyPage.newcorrectMonthArr,
      historyPage.newcorrectBalanceArr,
    );
    createBarChartRatio(
      'ratio',
      historyPage.newcorrectMonthArr,
      historyPage.transactionsHistory,
      historyPage.negativeTransArr,
      historyPage.positiveTransArr,
    );
  });
});

router.on('/account', async () => {
  app.innerHTML = '';
  setChildren(app, loader);
  const personalPage = await personal();
  setChildren(app, personalPage.container);
  configSelect();
  let token = localStorage.getItem('token');
  const numSort = document.querySelector('.number-sort');
  const balanceSort = document.querySelector('.balance-sort');
  const transSort = document.querySelector('.trans-sort');

  numSort.addEventListener('click', () => {
    sortCardListAccNumber(token, personalPage.sectionPay);
  });

  balanceSort.addEventListener('click', () => {
    sortCardListBalance(token, personalPage.sectionPay);
  });

  transSort.addEventListener('click', () => {
    sortCardListLastTransaction(token, personalPage.sectionPay);
  });
});

router.on('/:id', ({ data: { id } }) => {
  const token = localStorage.getItem('token');
  app.innerHTML = '';
  setChildren(app, loader);
  getAccount(id, token).then((responce) => {
    const detailPage = createDetailPage(responce.payload);
    setChildren(app, detailPage.pageContainer);
    createBarChart(
      'dynamic',
      detailPage.newcorrectMonthArr,
      detailPage.newcorrectBalanceArr,
    );
    const blockDynamicBalance = document.getElementById('dynamic-block');
    const blockStoryTranslations = document.getElementById('story');

    transitionToHistory(blockDynamicBalance);
    transitionToHistory(blockStoryTranslations);
  });
});

router.resolve();
