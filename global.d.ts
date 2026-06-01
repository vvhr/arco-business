/* prettier-ignore */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    AeForm: typeof import('acro-business')['AeForm']
    AbIcon: typeof import('acro-business')['AbIcon']
    AeTable: typeof import('acro-business')['AeTable']
    AeUpload: typeof import('acro-business')['AeUpload']
    AbModal: typeof import('acro-business')['AbModal']
    AbDrawer: typeof import('acro-business')['AbDrawer']
    AbText: typeof import('acro-business')['AbText']
    AeComboInput: typeof import('acro-business')['AeComboInput']
  }
}

export {}
