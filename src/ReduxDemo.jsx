import { useState, useSyncExternalStore } from 'react'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Action } from './components'

const cart = createSlice({
  name: 'cart',
  initialState: { items: 0, action: 'Store initialized' },
  reducers: {
    add(state) { state.items += 1; state.action = 'cart/add' },
    remove(state) { state.items = Math.max(0, state.items - 1); state.action = 'cart/remove' },
    clear(state) { state.items = 0; state.action = 'cart/clear' },
  },
})

export default function ReduxDemo() {
  const [store] = useState(() => configureStore({ reducer: { cart: cart.reducer } }))
  const state = useSyncExternalStore(store.subscribe, store.getState)
  return <div className="lab-demo">
    <div className="lab-controls">
      <div className="lab-actions">
        <Action onClick={() => store.dispatch(cart.actions.add())}>Add item</Action>
        <Action onClick={() => store.dispatch(cart.actions.remove())}>Remove item</Action>
        <Action onClick={() => store.dispatch(cart.actions.clear())}>Clear cart</Action>
      </div>
      <p className="lab-note">The reducer updates the cart slice. React subscribes to the store and reads the next snapshot.</p>
      <p role="status" className="mono">{state.cart.items} items · {state.cart.action}</p>
    </div>
    <pre className="lab-stage state-stage" aria-label="Current Redux state">{JSON.stringify(state, null, 2)}</pre>
  </div>
}
