export const ROUTES = {
  INTRODUCTION: {
    WELCOME: "/introduction",
    SHEET: "/introduction/sheet",
    COLUMNS: (sheetId?: string) => `/introduction/sheet/${sheetId}`,
    FINAL: (sheetId?: string) => `/introduction/sheet/${sheetId}/final`
  }
};
