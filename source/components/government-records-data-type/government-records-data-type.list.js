export const governmentRecordsDataTypeList = [
  {
    id: 1,
    title: 'Driver License',
    type: 'DriverLicense',
    icon: require('../../assets/png-images/Driving-License-Icon/driving-license.png'),
    show: false
  },
  {
    id: 2,
    title: 'Passport',
    type: 'Passport',
    icon: require('../../assets/png-images/Passport-Icon/passport.png'),
    show: false
  },
  {
    id: 3,
    title: 'Tax & SSN',
    type: 'TaxIdentification',
    icon: require('../../assets/png-images/Tax-SSN-Icon/tax.png'),
    show: false
  },
  {
    id: 4,
    title: `ID's`,
    type: 'IdentificationCards',
    icon: require('../../assets/png-images/Identification-Icon/identification.png'),
    show: false
  },
];

export const getDataAsType = [
  'DriverLicense',
  'Passport',
  'TaxIdentification',
  'IdentificationCards',
];
