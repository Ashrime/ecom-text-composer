
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  content: string;
  isLoading: boolean;
  width: number;
  height: number;
}

const initialState: EditorState = {
  content: '',
  isLoading: false,
  width: 800,
  height: 400,
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
    setDimensions: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.width = action.payload.width;
      state.height = action.payload.height;
    },
  },
});

export const { setContent, setLoading, setDimensions } = editorSlice.actions;
export default editorSlice.reducer;
