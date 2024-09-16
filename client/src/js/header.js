import { el } from 'redom';
import logo from '../assets/img/Logo.svg';
import { transToLink } from './utils';

export const createHeader = () => {
  const navBanks = el(
      'a',
      { class: 'header__btn-banks btn-head btn-reset', href: '/banks' },
      'Банкоматы',
    ),
    navAcc = el(
      'a',
      { class: 'header__btn-accounts btn-head btn-reset', href: '/account' },
      'Счета',
    ),
    navCurrency = el(
      'a',
      { class: 'header__btn-currency btn-head btn-reset', href: '/currency' },
      'Валюта',
    ),
    navExit = el(
      'a',
      { class: 'header__btn-exit btn-head btn-reset', href: '/' },
      'Выйти',
    ),
    headerNavigate = el('div', { class: 'header__navigate' }, [
      navBanks,
      navAcc,
      navCurrency,
      navExit,
    ]),
    headerLogo = el('img', { class: 'header__logo', src: logo }),
    headerLogoWrap = el('div', { class: 'header__wrap-logo' }, [headerLogo]),
    container = el('div', { class: 'header__container container' }, [
      headerLogoWrap,
      headerNavigate,
    ]),
    header = el('header', { class: 'header' }, [container]);

  if (window.location.pathname === '/account') {
    navAcc.classList.add('disabled');
  } else {
    navAcc.classList.remove('disabled');
  }

  if (window.location.pathname === '/banks') {
    navBanks.classList.add('disabled');
  } else {
    navBanks.classList.remove('disabled');
  }

  if (window.location.pathname === '/currency') {
    navCurrency.classList.add('disabled');
  } else {
    navCurrency.classList.remove('disabled');
  }

  navBanks.addEventListener('click', (e) => {
    navBanks.classList.add('disabled')
    navAcc.classList.remove('disabled')
    navCurrency.classList.remove('disabled')
    transToLink(e, 'href');
  });

  navAcc.addEventListener('click', (e) => {
    navAcc.classList.add('disabled')
    navBanks.classList.remove('disabled')
    navCurrency.classList.remove('disabled')
    transToLink(e, 'href');
  });

  navCurrency.addEventListener('click', (e) => {
    navCurrency.classList.add('disabled')
    navAcc.classList.remove('disabled')
    navBanks.classList.remove('disabled')
    transToLink(e, 'href');
  });


  navExit.addEventListener('click', (e) => {
    transToLink(e, 'href');
  });

  return header;
};
