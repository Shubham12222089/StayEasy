import React from 'react'
import { useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'
import { ShoppingCart } from 'lucide-react'

const CartPage = () => {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, getTotalPrice } = useCart()

  if (cart.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <ShoppingCart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Start exploring and add some rooms to your cart!</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onUpdateQuantity={updateCartItemQuantity}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxes & Fees:</span>
                <span className="font-semibold">${(getTotalPrice() * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 text-lg">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="font-bold text-2xl text-blue-600">
                ${(getTotalPrice() * 1.1).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary mb-3 py-3"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full btn-secondary py-3"
            >
              Continue Shopping
            </button>

            <button
              onClick={clearCart}
              className="w-full mt-4 text-red-600 hover:text-red-800 font-semibold"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
