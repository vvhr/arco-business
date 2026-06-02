/* prettier-ignore */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    AbForm: typeof import('arco-business')['AbForm']
    AbIcon: typeof import('arco-business')['AbIcon']
    AbTable: typeof import('arco-business')['AbTable']
    AbUpload: typeof import('arco-business')['AbUpload']
    AbModal: typeof import('arco-business')['AbModal']
    AbDrawer: typeof import('arco-business')['AbDrawer']
    AbText: typeof import('arco-business')['AbText']
    AbComboInput: typeof import('arco-business')['AbComboInput']
  }
}

export {}
