import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      const content = action.payload
      return content
    },
    closeNotification(state, action){
      return initialState
    }
  }
})

export const { showNotification, closeNotification } = notificationSlice.actions
export default notificationSlice.reducer