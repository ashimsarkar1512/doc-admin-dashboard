import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  pageTitle: string;
  pageSubtitle: string;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  pageTitle: 'Assessments',
  pageSubtitle: 'Create and manage user assessments for services',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setPageHeader(state, action: PayloadAction<{ title: string; subtitle: string }>) {
      state.pageTitle = action.payload.title;
      state.pageSubtitle = action.payload.subtitle;
    },
  },
});

export const { toggleSidebar, setPageHeader } = uiSlice.actions;
export default uiSlice.reducer;
