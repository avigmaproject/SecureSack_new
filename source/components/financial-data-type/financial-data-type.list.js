export const financialDataTypeList = [
  {
    id: 1,
    title: 'Bank Accounts',
    icon: require('../../assets/png-images/Bank-Account-Icon/bank-account-icon.png'),
    type: 'BankAccounts',
    show: false
  },
  {
    id: 2,
    title: 'Credit Cards',
    icon: require('../../assets/png-images/Card-Icon/card-icon.png'),
    type: 'CreditCard',
    show: false
  },
  {
    id: 3,
    title: 'Brokerage Account',
    icon: require('../../assets/png-images/Brokerage-Account-Icon/brokerage-account-icon.png'),
    type: 'BrokerageAccount',
    show: false
  },
  {
    id: 4,
    title: 'Mortgages',
    icon: require('../../assets/png-images/Mortgages-Icon/mortgages-icon.png'),
    type: 'Mortgage',
    show: false
  },
  {
    id: 5,
    title: 'Loans',
    icon: require('../../assets/png-images/Loans-Icon/loans-icon.png'),
    type: 'ConsumerLoan',
    show: false
  },
];

export const getDataAsType = [
  'BankAccounts',
  'CreditCard',
  'BrokerageAccount',
  'Mortgage',
  'ConsumerLoan',
];
