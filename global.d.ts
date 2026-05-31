/* prettier-ignore */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    AeForm: typeof import('acro-business')['AeForm']
    AeIcon: typeof import('acro-business')['AeIcon']
    AeTable: typeof import('acro-business')['AeTable']
    AeEditor: typeof import('acro-business')['AeEditor']
    AeUpload: typeof import('acro-business')['AeUpload']
    AeDialog: typeof import('acro-business')['AeDialog']
    AeDrawer: typeof import('acro-business')['AeDrawer']
    AeTabs: typeof import('acro-business')['AeTabs']
    AeTabPane: typeof import('acro-business')['AeTabPane']
    AeText: typeof import('acro-business')['AeText']
    AeComboInput: typeof import('acro-business')['AeComboInput']
  }
}

export {}
