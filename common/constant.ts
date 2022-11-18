import { GridPagerSettings } from '@progress/kendo-react-grid';

// export const API_BASE_CONFIG_MAIL = `${process.env.API_URL_BASE}/ConfigMail`;
// export const API_BASE_USER = `${process.env.API_URL_BASE}/User`;
export const API_BASE_CONFIG_MAIL = `http://localhost:62960/ConfigMail`;
export const API_BASE_USER = `http://localhost:62960/User`;

export const KEY_AUTH_SESSION = '9b7a7a3a-435d-4060-9358-9dc5a72efc91'; // fix temp
export const VALUE_COOKIE_AUTH = `DV_AUTH_SESSION_ID=${KEY_AUTH_SESSION}`;

export const OPERATING_COMPANY_SID = 460;

export const PAGE_ABLE: GridPagerSettings = {
  info: false,
  type: 'numeric',
  buttonCount: 3,
  pageSizes: [10, 20, 30, 50],
  previousNext: true,
};

export const orderDirectionType = ['asc', 'desc'];

export const fieldName = {
  mailSid: 'mailSid',
  fundCode: 'fundCode',
  fundName: 'fundName',
  printingCompanyName: 'printingCompanyName',

  printingCompanyEmail: 'userId',
  printingCompanyUserName: 'userName',

  flPrintingCompanyInfoSid: 'flPrintingCompanyInfoSid',
};
