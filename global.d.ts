/* prettier-ignore */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    AeForm: typeof import('acro-business')['AeForm']
    AbIcon: typeof import('acro-business')['AbIcon']
    Table: typeof import('acro-business')['Table']
    AbUpload: typeof import('acro-business')['AbUpload']
    AbModal: typeof import('acro-business')['AbModal']
    AbDrawer: typeof import('acro-business')['AbDrawer']
    AbText: typeof import('acro-business')['AbText']
    AbComboInput: typeof import('acro-business')['AbComboInput']
  }
}

export {}
