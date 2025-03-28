import {createSlice, createSelector, isAnyOf, type PayloadAction} from '@reduxjs/toolkit'

export type Folder = {
  id: string
  name: string
}

export type FoldersState = {
  folders: Folder[]
}

const initialState: FoldersState = {
  folders: [
    {id: '1', name: 'Work'},
    {id: '2', name: 'Personal'},
    {id: '3', name: 'Archived'}
  ]
}

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    addFolder: (state, action: PayloadAction<Folder>) => {
      state.folders.push(action.payload)
    },
    removeFolder: (state, action: PayloadAction<string>) => {
      state.folders = state.folders.filter(folder => folder.id !== action.payload)
    }
  }
})

export const {addFolder, removeFolder} = foldersSlice.actions
export default foldersSlice.reducer

export const selectFolders = (state: {folders: FoldersState}) => state.folders.folders
export const selectFolderById = (id: string) =>
  createSelector(selectFolders, folders => folders.find(folder => folder.id === id))
