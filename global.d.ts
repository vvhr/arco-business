/* prettier-ignore */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    AeForm: typeof import('acro-business')['AeForm']
    AeIcon: typeof import('acro-business')['AeIcon']
    AeTable: typeof import('acro-business')['AeTable']
    AeUpload: typeof import('acro-business')['AeUpload']
    AbModal: typeof import('acro-business')['AbModal']
    AbDrawer: typeof import('acro-business')['AbDrawer']
    AeText: typeof import('acro-business')['AeText']
    AeComboInput: typeof import('acro-business')['AeComboInput']
  }
}

export {}
