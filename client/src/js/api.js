export const login = async (login, password) => {
  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
};

export const getAccounts = async (token) => {
  const res = await fetch('http://localhost:3000/accounts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });

  return await res.json();
};

export const createAccount = async (token) => {
  const res = await fetch('http://localhost:3000/create-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });

  return await res.json();
};

export const getAccount = async (id, token) => {
  try {
    const res = await fetch(`http://localhost:3000/account/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const transferFunds = async (from, to, amount, token) => {
  return await fetch('http://localhost:3000/transfer-funds', {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
};

export const getBanks = async () => {
  return await fetch('http://localhost:3000/banks').then((res) => res.json());
};

export const getAllCurrencies = async () => {
  return await fetch('http://localhost:3000/all-currencies').then((data) =>
    data.json(),
  );
};

export const getAccountCurrencies = async (token) => {
  try {
    const res = await fetch('http://localhost:3000/currencies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getChangedCurrency = () => {
  return new WebSocket('ws://localhost:3000/currency-feed');
};

export const exchangeCurrency = async (from, to, amount, token) => {
  return await fetch('http://localhost:3000/currency-buy', {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
};
