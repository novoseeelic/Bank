import { Chart } from 'chart.js/auto';
import { el } from 'redom';
import {
  exchangeCurrency,
  getAccount,
  getAccounts,
  getAllCurrencies,
  getChangedCurrency,
  transferFunds,
} from './api';
import { router } from './main';
import { createCardList } from './createCardList';
import { createDetailPage } from './createDetailPage';

export const formatThousand = (numb) => {
  const numbFmt = numb.toLocaleString('ru-RU');
  return numbFmt;
};

export const transToLink = (event, href) => {
  event.preventDefault();
  router.navigate(event.target.getAttribute(href));
};

export const sortCardListAccNumber = (token, list) => {
  getAccounts(token).then((res) => {
    const arr = res.payload.map((res) => {
      return res;
    });
    const sortArr = arr.sort((a, b) => (a.account > b.account ? 1 : -1));

    list.innerHTML = '';

    for (const pay of sortArr) {
      createCardList(pay, list);
    }
  });
};

export const sortCardListBalance = (token, list) => {
  getAccounts(token).then((res) => {
    const arr = res.payload.map((res) => {
      return res;
    });
    const sortArr = arr.sort((a, b) => (a.balance > b.balance ? 1 : -1));

    list.innerHTML = '';

    for (const pay of sortArr) {
      createCardList(pay, list);
    }
  });
};

export const sortCardListLastTransaction = (token, list) => {
  getAccounts(token).then((res) => {
    const arr = res.payload.map((res) => {
      return res;
    });

    const sortArr = arr.sort((a, b) =>
      a.transactions[0].date > b.transactions[0].date ? 1 : -1,
    );

    list.innerHTML = '';

    for (const pay of sortArr) {
      createCardList(pay, list);
    }
  });
};

export const configSelect = () => {
  const dropdown = document.querySelectorAll('.personal__dropdown');

  dropdown.forEach(() => {
    const select = document.querySelector('.personal__select');
    const caret = document.querySelector('.personal__caret');
    const menu = document.querySelector('.personal__menu');
    const options = document.querySelectorAll('.personal__menu-item');
    const selected = document.querySelector('.personal__selected');

    select.addEventListener('click', () => {
      select.classList.toggle('personal__select-clicked');
      caret.classList.toggle('personal__caret-rotate');
      menu.classList.toggle('personal__menu-open');
    });

    document.addEventListener('click', (e) => {
      if (e.target !== select) {
        select.classList.remove('personal__select-clicked');
        caret.classList.remove('personal__caret-rotate');
        menu.classList.remove('personal__menu-open');
      }
    });

    options.forEach((option) => {
      option.addEventListener('click', () => {
        selected.innerText = option.innerText;
        select.classList.remove('personal__select-clicked');
        caret.classList.remove('personal__caret-rotate');
        menu.classList.remove('personal__menu-open');
        options.forEach((option) => {
          option.classList.remove('active');
        });
        option.classList.add('active');
      });
    });
  });
};

export const transitionToHistory = (block) => {
  block.addEventListener('click', (event) => {
    event.preventDefault();
    event.target.href = '/history-balance';
    router.navigate(event.target.href);
  });
};

export const createError = (input, text) => {
  const parentEl = input.parentNode;
  const errorLabel = el('label', { class: 'error-label' }, `${text}`);
  parentEl.append(errorLabel);
  parentEl.classList.add('error');
};

export const cleanError = (input) => {
  const parentEl = input.parentNode;
  if (parentEl.classList.contains('error')) {
    parentEl.querySelector('.error-label').remove();
    parentEl.classList.remove('error');
  }
};

export const validate = (form) => {
  let res = true;

  const inputs = form.querySelectorAll('.form__input');

  for (const input of inputs) {
    cleanError(input);

    if (input.dataset.minLength) {
      cleanError(input);
      if (input.value.length < input.dataset.minLength) {
        createError(
          input,
          `Введите не менее ${input.dataset.minLength} символов`,
        );
        res = false;
      }
    }
  }
  return res;
};

export const clearErrorMessage = (classList) => {
  const errorMessage = document.querySelector(classList);
  if (errorMessage) {
    errorMessage.remove();
  }
};

export const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(date).toLocaleDateString('ru-RU', options);
};

export const formatTime = (date) => {
  const newDate = new Date(date);

  const correctDate = {
    hour: 'numeric',
    minute: 'numeric',
  };
  const result = newDate.toLocaleString('ru', correctDate);

  return result;
};

export const createNewTranslation = (data) => {
  let token = localStorage.getItem('token');
  const newTransTitle = el(
      'h3',
      { class: 'new-trans__title title' },
      'Новый перевод',
    ),
    newTransNumbInput = el('input', { class: 'new-trans__input' }),
    newTransNumLabelSpan = el(
      'span',
      { class: 'new-trans__label-span' },
      'Номер счёта получателя',
    ),
    newTransAutocompleteList = el('ul', {
      class: 'new-trans__autocomplete',
      id: 'autoCompleteContainer',
    }),
    newTransNumbLabel = el('label', { class: 'new-trans__label' }, [
      newTransNumLabelSpan,
      newTransNumbInput,
      newTransAutocompleteList,
    ]),
    newTransSumInput = el('input', {
      class: 'new-trans__input',
      placeholder: 'Сумма',
    }),
    newTransSumLabelSpan = el(
      'span',
      { class: 'new-trans__label-span' },
      'Сумма перевода',
    ),
    newTransSumLabel = el('label', { class: 'new-trans__label' }, [
      newTransSumLabelSpan,
      newTransSumInput,
    ]),
    newTransBtnSpan = el('span', { class: 'new-trans__btn-span' }),
    newTransBtn = el(
      'button',
      { class: 'new-trans__btn btn btn-reset', type: 'submit' },
      [newTransBtnSpan],
      'Отправить',
    ),
    newTransBtnWrap = el('div', { class: 'new-trans__btn-wrap' }, [
      newTransBtn,
    ]),
    newTransForm = el('form', { class: 'new-trans__form', action: '' }, [
      newTransNumbLabel,
      newTransSumLabel,
      newTransBtnWrap,
    ]),
    newTransWrap = el('div', { class: 'new-trans__wrap' }, [newTransForm]),
    newTranslation = el('div', { class: 'translations__new-trans new-trans' }, [
      newTransTitle,
      newTransWrap,
    ]);

  newTransForm.addEventListener('submit', (event) => {
    event.preventDefault();
    cleanError(newTransBtn);
    cleanError(newTransSumInput);
    const amount = parseFloat(newTransSumInput.value);

    if (
      newTransNumbInput.value.trim() === '' ||
      newTransSumInput.value.trim() === ''
    ) {
      newTransNumbInput.classList.add('error');
      newTransSumInput.classList.add('error');
      newTransNumbLabel.classList.add('error-label');
      newTransSumLabel.classList.add('error-label');
      createError(newTransBtn, 'Заполните все поля');
    } else if (isNaN(amount) || amount <= 0) {
      newTransNumbInput.classList.remove('error');
      newTransNumbLabel.classList.remove('error-label');
      createError(newTransSumInput, 'Введите значение больше 0');
    } else if (newTransSumInput.value > data.balance) {
      newTransSumInput.classList.add('error');
      newTransSumLabel.classList.add('error-label');
      createError(newTransSumInput, 'Недостаточно средств');
    } else {
      newTransNumbInput.classList.remove('error');
      newTransSumInput.classList.remove('error');
      newTransNumbLabel.classList.remove('error-label');
      newTransSumLabel.classList.remove('error-label');
      transferFunds(
        data.account,
        newTransNumbInput.value,
        newTransSumInput.value,
        token,
      );

      const tableBody = document.querySelector('.table__body');
      tableBody.remove();

      getAccount(data.account, token).then((responce) => {
        const balanceWrap = document.querySelector('.account__balance-wrap');
        const balance = document.querySelector('.account__balance-check');
        balance.remove();
        const translations = document.querySelector('.story__table');
        const newBalance = createDetailPage(responce.payload);
        const historyTrans = createHistoryTranslations(
          responce.payload,
          -10,
          'story',
        );
        balanceWrap.append(newBalance.balanceCheck);
        translations.append(historyTrans.storyBody);
      });
    }

    const recipient = newTransNumbInput.value.trim();
    let savedAccounts =
      JSON.parse(localStorage.getItem('recipientAccounts')) || [];
    savedAccounts.push(recipient);
    const uniqueSavedAccounts = new Set(savedAccounts);
    const newUniqueSavedAccounts = Array.from(uniqueSavedAccounts);
    localStorage.setItem(
      'recipientAccounts',
      JSON.stringify(newUniqueSavedAccounts),
    );

    newTransNumbInput.value = '';
    newTransSumInput.value = '';
  });

  accountsList(newTransNumbInput);

  return {
    newTranslation,
  };
};

export const createDynamicBalance = (nameBar, barId, page) => {
  const title = el('h3', { class: `${page}__title title` }, `${nameBar}`),
    bar = el('canvas', { id: barId, class: `${page}__chart` }),
    barWrap = el('div', { class: `${page}__chart-wrap` }, [bar]),
    dynamicBalance = el(
      'div',
      { class: `translations__dynamic ${page}`, id: 'dynamic-block' },
      [title, barWrap],
    );

  return {
    dynamicBalance,
  };
};

export const createBarChart = (barId, months, balance) => {
  const bar = document.getElementById(barId);
  const minBalance = Math.min(...balance);
  const maxBalance = Math.max(...balance);

  new Chart(bar, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Баланс',
          backgroundColor: '#116acc',
          data: balance,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: false,
      },
      scales: {
        y: {
          position: 'right',
          ticks: {
            callback: function (value) {
              return `${Math.floor(value)} ₽`;
            },
          },
          min: minBalance,
          max: maxBalance,
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
};

export const createBarChartRatio = (
  barId,
  months,
  transactionsHistory,
  positiveTransArr,
  negativeTransArr,
) => {
  const barRatio = document.getElementById(barId);

  const minTransaction = Math.min(...transactionsHistory);
  const maxTransaction = Math.max(...transactionsHistory);

  new Chart(barRatio, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Негативные транзакции',
          backgroundColor: '#ba0000',
          data: positiveTransArr,
          stack: 'Stack 0',
        },
        {
          label: 'Положительные транзакции',
          backgroundColor: '#76ca66',
          data: negativeTransArr,
          stack: 'Stack 0',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: false,
      },
      scales: {
        y: {
          position: 'right',
          ticks: {
            callback: function (value) {
              return `${Math.floor(value)} ₽`;
            },
          },
          min: minTransaction,
          max: maxTransaction,
          stacked: true,
        },
        x: {
          grid: {
            display: false,
          },
          stacked: true,
        },
      },
    },
  });
};

export const createHistoryTranslations = (data, count, page) => {
  const title = el('h3', { class: 'story__title title' }, 'История переводов'),
    headSendersAcc = el('th', { class: 'table__th' }, 'Счёт отправителя'),
    headRecipientsAcc = el('th', { class: 'table__th' }, 'Счёт получателя'),
    headSum = el('th', { class: 'table__th' }, 'Сумма'),
    headDate = el('th', { class: 'table__th' }, 'Дата'),
    headRow = el('tr', { class: 'table__head-row' }, [
      headSendersAcc,
      headRecipientsAcc,
      headSum,
      headDate,
    ]),
    storyHead = el('thead', { class: 'table__head' }, [headRow]),
    storyBody = el('tbody', { class: 'table__body' }),
    storyTable = el('table', { class: 'story__table table' }, [
      storyHead,
      storyBody,
    ]),
    storyTableWrap = el('div', { class: 'story__table-wrap' }, [storyTable]),
    storyTranslations = el(
      'div',
      { class: `translations__story ${page}`, id: 'story' },
      [title, storyTableWrap],
    );

  data.transactions.slice(count).map((response) => {
    const tbodySendersAcc = el(
        'td',
        { class: 'table__td' },
        `${response.from}`,
      ),
      tbodyRecipientsAcc = el('td', { class: 'table__td' }, `${response.to}`),
      tbodySum = el('td', { class: 'table__td' }, `${response.amount} ₽`),
      tbodyDate = el(
        'td',
        { class: 'table__td' },
        `${formatDate(response.date)}`,
      ),
      tbodyRow = el('tr', { class: 'table__body-row' }, [
        tbodySendersAcc,
        tbodyRecipientsAcc,
        tbodySum,
        tbodyDate,
      ]);
    storyBody.prepend(tbodyRow);

    if (data.account === response.from) {
      tbodySum.style.color = 'var(--error)';
      tbodySum.innerText = `- ${formatThousand(response.amount)} ₽`;
    } else {
      tbodySum.style.color = 'var(--success)';
      tbodySum.innerText = `+ ${formatThousand(response.amount)} ₽`;
    }
  });

  return {
    storyTranslations,
    storyBody,
  };
};

export const createAvailableCurrencies = (data) => {
  const currencies = Object.values(data);

  const title = el('h3', { class: 'available__title title' }, 'Ваши валюты'),
    tbody = el('tbody', { class: 'available__table-tbody' }),
    tableCurrencies = el('table', { class: 'available__table' }, [tbody]),
    availableCurrenciesBlock = el(
      'div',
      { class: 'currency__available available' },
      [title, tableCurrencies],
    );

  for (const item of currencies) {
    const thDecor = el('span', { class: 'available__table-th-decor' }),
      thText = el(
        'span',
        { class: 'available__table-th-text' },
        `${item.code}`,
      ),
      th = el('th', { class: 'available__table-th' }, [thDecor, thText]),
      tdText = el(
        'span',
        { class: 'available__table-td-text' },
        `${item.amount.toFixed(2)}`,
      ),
      td = el('td', { class: 'available__table-td' }, [tdText]),
      tr = el('tr', { class: 'available__table-tr' }, [th, td]);

    tbody.append(tr);
  }

  return { availableCurrenciesBlock, tbody };
};

export const createExchangeCurrency = () => {
  let token = localStorage.getItem('token');
  const title = el('h3', { class: 'exchange__title title' }, 'Обмен валюты'),
    fromInp = el('select', { class: 'exchange__input' }),
    fromLabel = el('label', { class: 'exchange__label' }, 'Из', [fromInp]),
    toInp = el('select', { class: 'exchange__input' }),
    toLabel = el('label', { class: 'exchange__label' }, 'в', [toInp]),
    sumInp = el('input', { class: 'exchange__input' }),
    sumLabel = el('label', { class: 'exchange__label' }, 'Сумма', [sumInp]),
    wrapInputs = el('div', { class: 'exchange__wrap-inputs' }, [
      fromLabel,
      toLabel,
      sumLabel,
    ]),
    exchangeBtn = el(
      'button',
      { class: 'exchange__btn btn btn-reset', type: 'submit' },
      'Обменять',
    ),
    exchangeForm = el('form', { class: 'exchange__form' }, [
      wrapInputs,
      exchangeBtn,
    ]),
    exchangeWrapper = el('div', { class: 'exchange__wrapper' }, [exchangeForm]),
    exchangeBlock = el('div', { class: 'currency__exchange exchange' }, [
      title,
      exchangeWrapper,
    ]);

  getAllCurrencies().then((responce) => {
    responce.payload.forEach((currency) => {
      const fromOptionCurrency = el(
        'option',
        { class: 'exchange__option' },
        `${currency}`,
      );
      const toOptionCurrency = el(
        'option',
        { class: 'exchange__option' },
        `${currency}`,
      );
      fromInp.append(fromOptionCurrency);
      toInp.append(toOptionCurrency);
    });
  });

  exchangeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    cleanError(sumInp);
    const amount = parseFloat(sumInp.value);

    if (sumInp.value.trim() === '') {
      sumInp.classList.add('error');
      sumLabel.classList.add('error-label');
      createError(sumInp, 'Заполните поле');
    } else if (isNaN(amount) || amount <= 0) {
      sumInp.classList.add('error');
      sumLabel.classList.add('error-label');
      createError(sumInp, 'Введите значение больше 0');
    } else {
      sumInp.classList.remove('error');
      sumLabel.classList.remove('error-label');

      exchangeCurrency(fromInp.value, toInp.value, sumInp.value, token).then(
        (response) => {
          switch (response.error) {
            case 'Overdraft prevented':
              createError(sumInp, 'Недостаточно средств на счёте списания');
              break;
            case 'Not enough currency':
              createError(sumInp, 'Недостаточно средств на счёте списания');
              break;
            default:
              const availableTBody = document.querySelector(
                '.available__table-tbody',
              );
              availableTBody.remove();
              const rewriteAvailableCurrencies = createAvailableCurrencies(
                response.payload,
              );
              const availableTable =
                document.querySelector('.available__table');
              availableTable.append(rewriteAvailableCurrencies.tbody);
              break;
          }
        },
      );
    }

    sumInp.value = '';
  });

  return { exchangeBlock };
};

export const createChangingRates = () => {
  const title = el(
      'h3',
      { class: 'changing__title title' },
      'Изменение курсов в реальном времени',
    ),
    tbody = el('tbody', { class: 'changing__table-tbody' }),
    tableCurrencies = el('table', { class: 'changing__table' }, [tbody]),
    wrapTableCurrencies = el('div', { class: 'changing__table-wrap' }, [
      tableCurrencies,
    ]),
    changingBlock = el('div', { class: 'currency__changing changing' }, [
      title,
      wrapTableCurrencies,
    ]);

  const currencyNews = getChangedCurrency();

  currencyNews.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    const thDecor = el('span', { class: 'changing__table-th-decor' }),
      thText = el(
        'span',
        { class: 'changing__table-th-text' },
        `${data.from} / ${data.to}`,
      ),
      th = el('th', { class: 'changing__table-th' }, [thDecor, thText]),
      tdText = el('span', { class: 'changing__table-td-text' }, `${data.rate}`),
      td = el('td', { class: 'changing__table-td' }, [tdText]),
      trDecor = el('div', { class: 'changing__table-tr-decor' }),
      tr = el('tr', { class: 'changing__table-tr' }, [th, td, trDecor]);

    data.change === 1
      ? trDecor.classList.add('up')
      : trDecor.classList.add('down');

    tbody.prepend(tr);
  });

  return { changingBlock };
};

export const createPreloader = () => {
  const preloaderBlock = document.createElement('div'),
    preloaderCircle = document.createElement('span');

  preloaderBlock.classList.add('preloader');
  preloaderCircle.classList.add('preloader-circle');

  preloaderBlock.append(preloaderCircle);

  return preloaderBlock;
};

export const accountsList = (input) => {
  input.addEventListener('input', () => {
    const recipient = input.value.trim();
    const savedAccounts =
      JSON.parse(localStorage.getItem('recipientAccounts')) || [];
    const filteredAccounts = savedAccounts.filter((account) =>
      account.startsWith(recipient),
    );
    displayAutoComplete(filteredAccounts);
  });

  function displayAutoComplete(accounts) {
    const autoCompleteContainer = document.getElementById(
      'autoCompleteContainer',
    );
    autoCompleteContainer.classList.remove('new-trans__autocomplete-dnone');
    autoCompleteContainer.innerHTML = '';

    accounts.forEach((account) => {
      const option = el('li', { class: 'new-trans__autocomplete-item' });
      option.textContent = account;
      option.addEventListener('click', () => {
        input.value = account;
        autoCompleteContainer.classList.add('new-trans__autocomplete-dnone');
      });
      autoCompleteContainer.appendChild(option);
    });
  }
};
