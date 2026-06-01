/* prettier-ignore */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    AbForm: typeof import('acro-business')['AbForm']
    AbIcon: typeof import('acro-business')['AbIcon']
    AbTable: typeof import('acro-business')['AbTable']
    AbUpload: typeof import('acro-business')['AbUpload']
    AbModal: typeof import('acro-business')['AbModal']
    AbDrawer: typeof import('acro-business')['AbDrawer']
    AbText: typeof import('acro-business')['AbText']
    AbComboInput: typeof import('acro-business')['AbComboInput']
  }
}

export {}
