import { el } from 'redom';
import { router } from './main';
import { login } from './api';
import { cleanError, createError, createPreloader, validate } from './utils';

export const createLoginPage = () => {
  const headerNavigate = document.querySelector('.header__navigate');
  headerNavigate.style.display = 'none';

  const formTitle = el('h1', { className: 'form__title' }, 'Вход в аккаунт'),
    formLoginInput = el('input', {
      className: 'form__input login-input',
      type: 'text',
      placeholder: 'Логин',
    }),
    formLoginWrap = el('div', { className: 'form__wrap-login' }, [
      formLoginInput,
    ]),
    formPassInput = el('input', {
      className: 'form__input password-input',
      type: 'password',
      placeholder: 'Пароль',
    }),
    formPassWrap = el('div', { className: 'form__wrap-pass' }, [formPassInput]),
    formBtn = el(
      'button',
      { className: 'form__btn btn btn-reset', type: 'submit' },
      'Войти',
    ),
    loginForm = el('form', { className: 'login__form form' }, [
      formTitle,
      formLoginWrap,
      formPassWrap,
      formBtn,
    ]),
    loginContainer = el('div', { class: 'login__container container' }, [loginForm]),
    loginSection = el('section', { class: 'login' }, [
      loginContainer
    ]);

  formLoginInput.setAttribute('data-min-length', '6');
  formPassInput.setAttribute('data-min-length', '6');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const app = document.querySelector('.app');
    const loader = createPreloader();

    cleanError(formBtn);

    if (validate(loginForm)) {
      app.innerHTML = ''
      app.append(loader);
      await login(formLoginInput.value, formPassInput.value).then((res) => {
        if (res.payload) {
          router.navigate('/account');
          localStorage.setItem('token', res.payload.token);
        } else {
          createError(formBtn, 'Пользователь не найден');
        }
      }).finally(() => { loader.remove() });
    }
  });

  return {
    loginSection,
  };
};
