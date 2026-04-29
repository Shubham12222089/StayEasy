import * as Lucide from 'lucide-react'
import React from 'react'

const FallbackIcon = ({ className = '', ...props }) => (
  <span className={className} {...props} aria-hidden="true">•</span>
)

const pick = (name) => Lucide[name] ?? FallbackIcon

export const ShoppingCart = pick('ShoppingCart')
export const LogOut = pick('LogOut')
export const User = pick('User')
export const Hotel = pick('Hotel')
export const MapPin = pick('MapPin')
export const Star = pick('Star')
export const ArrowRight = pick('ArrowRight')
export const Sparkles = pick('Sparkles')
export const Users = pick('Users')
export const Wifi = pick('Wifi')
export const Tv = pick('Tv')
export const Coffee = pick('Coffee')
export const BadgeCheck = pick('BadgeCheck')
export const Trash2 = pick('Trash2')
export const AlertCircle = pick('AlertCircle')
export const CheckCircle = pick('CheckCircle')
export const Info = pick('Info')
export const Search = pick('Search')
export const Filter = pick('Filter')
export const RefreshCw = pick('RefreshCw')
export const Building2 = pick('Building2')
export const MapPinned = pick('MapPinned')
export const Phone = pick('Phone')
export const ArrowLeft = pick('ArrowLeft')
export const CheckCircle2 = pick('CheckCircle2')
export const CreditCard = pick('CreditCard')
export const Home = pick('Home')
export const Download = pick('Download')
export const ReceiptText = pick('ReceiptText')
export const ShieldCheck = pick('ShieldCheck')
export const CalendarDays = pick('CalendarDays')
export const StarHalf = pick('StarHalf')
export const StarFull = pick('StarFull')
export const StarEmpty = pick('StarEmpty')
