import type {ClientError, Transaction} from '@sanity/client'
import {
  createSlice,
  createSelector,
  isAnyOf,
  type PayloadAction,
  createAsyncThunk
} from '@reduxjs/toolkit'
import type {Asset, HttpError, MyEpic, TagSelectOption, Tag, TagItem, Folder} from '../../types'
import {bufferTime, catchError, filter, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators'
import {from, Observable, of} from 'rxjs'
import debugThrottle from '../../operators/debugThrottle'
import groq from 'groq'
import {FOLDER_DOCUMENT_NAME} from '../../constants'

export type FoldersState = {
  folders: Folder[]
  loading: boolean
  error: string | null
  fetching: boolean
  fetchingError?: HttpError | null
}

// Initial state
const initialState: FoldersState = {
  folders: [],
  loading: false,
  error: null,
  fetching: false,
  fetchingError: null
}

// Slice definition
const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    addFolder: (state, action: PayloadAction<Folder>) => {
      state.folders.push(action.payload)
    },
    removeFolder: (state, action: PayloadAction<string>) => {
      state.folders = state.folders.filter(folder => folder.id !== action.payload)
    },
    fetchError(state, action: PayloadAction<{error: HttpError}>) {
      const {error} = action.payload
      state.fetching = false
      state.fetchingError = error
    },
    fetchRequest: {
      reducer: (state, _action: PayloadAction<{query: string}>) => {
        state.fetching = true
        delete state.fetchingError
      },
      prepare: () => {
        // Construct query
        const query = groq`
          {
            "items": *[
              _type == "${FOLDER_DOCUMENT_NAME}"
              && !(_id in path("drafts.**"))
            ] {
              _id,
              _type,
              name
            } | order(name.current asc),
          }
        `
        return {payload: {query}}
      }
    },
    fetchComplete(state, action: PayloadAction<{folders: Folder[]}>) {
      const {folders} = action.payload

      state.folders = [...folders]

      // folders?.forEach(folder => {
      //   state.folders.push(folder)
      // })

      state.fetching = false
      delete state.fetchingError
    }
  }
})

// Async fetch folders
export const foldersFetchEpic: MyEpic = (action$, state$, {client}) =>
  action$.pipe(
    filter(foldersSlice.actions.fetchRequest.match),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const {query} = action.payload

      return of(action).pipe(
        // Optionally throttle
        debugThrottle(state.debug.badConnection),
        // Fetch tags
        mergeMap(() =>
          client.observable.fetch<{
            items: Folder[]
          }>(query)
        ),
        // Dispatch complete action
        mergeMap(result => {
          const {items} = result
          return of(foldersSlice.actions.fetchComplete({folders: items}))
        }),
        catchError((error: ClientError) =>
          of(
            foldersSlice.actions.fetchError({
              error: {
                message: error?.message || 'Internal error',
                statusCode: error?.statusCode || 500
              }
            })
          )
        )
      )
    })
  )

// Exports
export const {addFolder, removeFolder} = foldersSlice.actions
export default foldersSlice.reducer

// Selectors
export const selectFolders = (state: {folders: FoldersState}) => state.folders.folders
export const selectFolderById = (id: string) =>
  createSelector(selectFolders, folders => folders.find(folder => folder.id === id))
export const selectFoldersLoading = (state: {folders: FoldersState}) => state.folders.loading
export const selectFoldersError = (state: {folders: FoldersState}) => state.folders.error

// Actions
export const foldersActions = {...foldersSlice.actions}
