import React from 'react'
import { Trash2 } from './ui-icons'

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="card p-5 flex gap-5">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-800">{item.roomName}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.hotelName}</p>

        <div className="text-sm text-gray-600 mb-3">
          <p>
            <span className="font-semibold">Check-in:</span> {new Date(item.checkInDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Check-out:</span> {new Date(item.checkOutDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Duration:</span> {item.nights} nights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700">Quantity:</label>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
            className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <div>
          <p className="text-gray-600 text-sm">Price per night</p>
          <p className="text-2xl font-bold text-blue-600">${item.price}</p>
        </div>

        <div className="text-right mb-4">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-xl font-bold text-gray-800">${item.totalPrice.toFixed(2)}</p>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default CartItem
