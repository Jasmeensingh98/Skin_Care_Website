import { create } from 'zustand'

export const useStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  user: JSON.parse(localStorage.getItem('user')) || null,
  wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],

  // Cart actions
  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item._id === product._id)
    let newCart
    if (existingItem) {
      newCart = state.cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      )
    } else {
      newCart = [...state.cart, { ...product, quantity: product.quantity || 1 }]
    }
    localStorage.setItem('cart', JSON.stringify(newCart))
    return { cart: newCart }
  }),

  removeFromCart: (productId) => set((state) => {
    const newCart = state.cart.filter(item => item._id !== productId)
    localStorage.setItem('cart', JSON.stringify(newCart))
    return { cart: newCart }
  }),

  updateCartItem: (productId, quantity) => set((state) => {
    const newCart = quantity <= 0
      ? state.cart.filter(item => item._id !== productId)
      : state.cart.map(item =>
          item._id === productId ? { ...item, quantity } : item
        )
    localStorage.setItem('cart', JSON.stringify(newCart))
    return { cart: newCart }
  }),

  clearCart: () => set(() => {
    localStorage.removeItem('cart')
    return { cart: [] }
  }),

  // User actions
  setUser: (user) => set(() => {
    localStorage.setItem('user', JSON.stringify(user))
    return { user }
  }),

  logout: () => set(() => {
    localStorage.removeItem('user')
    return { user: null }
  }),

  // Wishlist actions
  addToWishlist: (product) => set((state) => {
    const newWishlist = [...state.wishlist, product]
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
    return { wishlist: newWishlist }
  }),

  removeFromWishlist: (productId) => set((state) => {
    const newWishlist = state.wishlist.filter(item => item._id !== productId)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
    return { wishlist: newWishlist }
  }),
}))
