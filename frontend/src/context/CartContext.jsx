import React, { createContext, useState } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  const addToCart = (room, checkInDate, checkOutDate, quantity = 1) => {
    const price = Number(room.price ?? room.pricePerNight ?? 0)
    const nights = calculateNights(checkInDate, checkOutDate)

    const cartItem = {
      id: `${room.id}-${checkInDate}-${checkOutDate}`,
      roomId: room.id,
      hotelId: room.hotelId,
      roomName: room.name || room.roomType || 'Room',
      hotelName: room.hotelName,
      price,
      checkInDate,
      checkOutDate,
      quantity,
      nights,
      totalPrice: price * nights * quantity
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === cartItem.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + quantity, totalPrice: item.price * item.nights * (item.quantity + quantity) }
            : item
        )
      }
      return [...prevCart, cartItem]
    })
  }

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId))
  }

  const updateCartItemQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity, totalPrice: item.price * item.nights * quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalPrice = () => cart.reduce((total, item) => total + item.totalPrice, 0)

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    return Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)))
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getTotalPrice,
    cartCount: cart.length
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
