export const calculateTotalDebit = (transactions = []) => {
  return transactions.reduce((total, t) => total + (Number(t.debit) || 0), 0);
};

export const calculateTotalCredit = (transactions = []) => {
  return transactions.reduce((total, t) => total + (Number(t.credit) || 0), 0);
};

export const calculateBalance = (transactions = [], ledger = null) => {
  const debit = calculateTotalDebit(transactions);
  const credit = calculateTotalCredit(transactions);
  
  let openingBalance = 0;
  let isDebitOpening = true;

  if (ledger) {
    openingBalance = Number(ledger.opening_balance) || 0;
    isDebitOpening = (ledger.opening_balance_type || 'Debit').toLowerCase() === 'debit';
  }

  if (isDebitOpening) {
    return openingBalance + debit - credit;
  } else {
    // If opening balance is credit, a positive result here means net Credit.
    // However, the rest of the application assumes positive = Debit.
    // So to remain consistent where positive = Debit, we should do:
    return (openingBalance * -1) + debit - credit;
  }
};

export const getBalanceDirection = (balance, ledger = null) => {
  let isDebitOpening = true;
  if (ledger) {
    isDebitOpening = (ledger.opening_balance_type || 'Debit').toLowerCase() === 'debit';
  }
  
  if (isDebitOpening) {
    return balance >= 0 ? 'Dr' : 'Cr';
  } else {
    // Note: because we negated opening credit balance above, positive still means net Debit.
    return balance > 0 ? 'Dr' : 'Cr';
  }
};

export const formatCurrencyWithDirection = (amount, direction) => {
  return `${formatCurrency(Math.abs(amount))} ${direction}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};
