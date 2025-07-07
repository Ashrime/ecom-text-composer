
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  content: string;
  isLoading: boolean;
}

const initialState: EditorState = {
  content: '',
  isLoading: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setContent, setLoading } = editorSlice.actions;
export default editorSlice.reducer;
