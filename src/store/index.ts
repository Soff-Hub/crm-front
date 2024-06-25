// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import dashboard from 'src/store/apps/dashboard'
import leads from 'src/store/apps/leads'
import groups from 'src/store/apps/groups'
import mentors from 'src/store/apps/mentors'
import students from 'src/store/apps/students'
import settings from 'src/store/apps/settings'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    dashboard,
    leads,
    groups,
    mentors,
    students,
    settings
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
