import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import useTraks from '../lib/useTraks'

declare global {
  interface Window {
    traks: jest.Mock
  }
}

beforeEach(() => {
  window.traks = jest.fn()
})

function TestComponent() {
  const traks = useTraks()

  return (
    <>
      <button
        data-testid="signup"
        onClick={() => traks('signup', { plan: 'pro' })}
      >
        Signup
      </button>
      <button
        data-testid="purchase"
        onClick={() => traks('purchase', { sku: 'T100' }, 49.99)}
      >
        Purchase
      </button>
      <button data-testid="click" onClick={() => traks('click')}>
        Click
      </button>
    </>
  )
}

test('sends event with props', () => {
  render(<TestComponent />)
  fireEvent.click(screen.getByTestId('signup'))
  expect(window.traks).toHaveBeenCalledWith('signup', { plan: 'pro' })
})

test('sends event with props and value', () => {
  render(<TestComponent />)
  fireEvent.click(screen.getByTestId('purchase'))
  expect(window.traks).toHaveBeenCalledWith('purchase', { sku: 'T100' }, 49.99)
})

test('sends event without optional arguments', () => {
  render(<TestComponent />)
  fireEvent.click(screen.getByTestId('click'))
  expect(window.traks).toHaveBeenCalledWith('click')
})

test('supports typed events', () => {
  type MyEvents = {
    signup: { plan: string }
    purchase: { sku: string }
    click: never
  }

  function TypedComponent() {
    const traks = useTraks<MyEvents>()
    return (
      <button onClick={() => traks('signup', { plan: 'pro' })}>
        Typed signup
      </button>
    )
  }

  render(<TypedComponent />)
  fireEvent.click(screen.getByText('Typed signup'))
  expect(window.traks).toHaveBeenCalledWith('signup', { plan: 'pro' })
})
