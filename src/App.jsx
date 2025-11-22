import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { ShoppingCart, Search, Crown, Sparkles, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import { apiGet, apiPost, API_BASE } from './lib/api'

function Hero() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0"> 
        <Spline scene="https://prod.spline.design/HldEaEeFcKnMlQB3/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/70 pointer-events-none"/>
      <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-start">
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          NavKar Jewellery
        </motion.h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="mt-4 max-w-xl text-slate-200">
          Crystal-clear brilliance. Handcrafted rings, necklaces and earrings with timeless elegance.
        </motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="mt-8 flex gap-3">
          <a href="#catalog" className="px-5 py-3 bg-white text-slate-900 rounded-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4"/> Explore Collection
          </a>
          <a href="#about" className="px-5 py-3 border border-white/30 rounded-lg">Why NavKar?</a>
        </motion.div>
      </div>
    </section>
  )
}

function Navbar({cartCount, onOpenCart}){
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-yellow-300"/>
          <span className="font-bold tracking-wide">NavKar</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#catalog" className="hover:text-yellow-200">Shop</a>
          <a href="#about" className="hover:text-yellow-200">About</a>
          <a href="#contact" className="hover:text-yellow-200">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
            <Search className="w-5 h-5"/>
          </button>
          <button onClick={onOpenCart} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 relative">
            <ShoppingCart className="w-5 h-5"/>
            {cartCount>0 && <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full">{cartCount}</span>}
          </button>
          <button className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20">
            <Menu className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
  )
}

function ProductCard({p, onAdd}){
  return (
    <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-shadow">
      <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50">
        <img src={p.image_url || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200&auto=format&fit=crop'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-slate-800">{p.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">₹{p.price}</span>
          <button onClick={()=>onAdd(p)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm">Add to Cart</button>
        </div>
      </div>
    </motion.div>
  )
}

function CartDrawer({open, items, onClose, onCheckout}){
  const total = items.reduce((s,i)=> s + i.price * i.qty, 0)
  return (
    <div className={`fixed inset-0 z-[60] ${open?'':'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/50 transition-opacity ${open?'opacity-100':'opacity-0'}`} onClick={onClose}/>
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform ${open?'translate-x-0':'translate-x-full'}`}>
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Your Cart</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Close</button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-170px)]">
          {items.length===0 && <p className="text-slate-500">Your cart is empty.</p>}
          {items.map((it,idx)=> (
            <div key={idx} className="flex gap-3 items-center">
              <img src={it.image_url} alt={it.name} className="w-16 h-16 rounded object-cover"/>
              <div className="flex-1">
                <p className="font-medium">{it.name}</p>
                <p className="text-sm text-slate-500">Qty: {it.qty}</p>
              </div>
              <div className="font-semibold">₹{(it.price*it.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="p-5 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-bold">₹{total.toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} className="w-full bg-slate-900 text-white py-3 rounded-lg">Checkout</button>
        </div>
      </div>
    </div>
  )
}

function Catalog({onAdd}){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    apiGet('/api/products').then(setProducts).finally(()=>setLoading(false))
  },[])

  return (
    <section id="catalog" className="relative z-10 bg-gradient-to-b from-slate-950 to-slate-900 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Featured Pieces</h2>
            <p className="text-slate-300">Curated elegance for every occasion</p>
          </div>
        </div>
        {loading? (
          <p className="text-slate-400">Loading products...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p=> <ProductCard key={p.id} p={p} onAdd={(prod)=>onAdd({...prod, qty:1})}/>)}
          </div>
        )}
      </div>
    </section>
  )
}

function CheckoutModal({open, items, onClose}){
  const total = items.reduce((s,i)=> s + i.price * i.qty, 0)
  const [form, setForm] = useState({name:'', email:'', phone:'', address:'', city:'', zip_code:'', country:'India', payment_method:'card'})
  const submit = async ()=>{
    const payload = {
      items: items.map(i=>({product_id: i.id, quantity: i.qty})),
      customer: {
        name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, zip_code: form.zip_code, country: form.country
      },
      payment_method: form.payment_method
    }
    const order = await apiPost('/api/orders', payload)
    alert(`Order placed! ID: ${order.id}. Status: ${order.status}. Total: ₹${order.total_amount}`)
    onClose()
  }
  return (
    <div className={`fixed inset-0 z-[70] ${open?'' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/60 ${open?'opacity-100':'opacity-0'} transition-opacity z-0`} onClick={onClose}/>
      <div className={`absolute left-1/2 top-1/2 w-[95%] sm:w-[640px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 transition-transform ${open?'scale-100':'scale-95'} z-10`}>
        <h3 className="text-xl font-semibold mb-4">Checkout</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {['name','email','phone','address','city','zip_code','country'].map((k)=> (
            <input
              key={k}
              placeholder={k.replace('_',' ').toUpperCase()}
              value={form[k]}
              onChange={e=>setForm({...form,[k]:e.target.value})}
              className="border rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          ))}
          <select
            value={form.payment_method}
            onChange={e=>setForm({...form, payment_method:e.target.value})}
            className="border rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-slate-600">Total</span>
          <span className="font-bold">₹{total.toFixed(2)}</span>
        </div>
        <div className="mt-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-slate-900 text-white">Place Order</button>
        </div>
      </div>
    </div>
  )
}

function Footer(){
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 py-10">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row gap-6 justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-white mb-2"><Crown className="w-5 h-5 text-yellow-300"/> <span className="font-semibold">NavKar Jewellery</span></div>
          <p>Where brilliance meets craftsmanship.</p>
        </div>
        <div className="text-sm">
          <p>Email: hello@navkarjewels.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>
    </footer>
  )
}

function AdminPanel(){
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({name:'', description:'', price:'', category:'Rings', image_url:''})
  const [token, setToken] = useState('admin123')

  const load = ()=> apiGet('/api/products').then(setProducts)
  useEffect(()=>{ load() },[])

  const add = async ()=>{
    const payload = { ...form, price: parseFloat(form.price||'0'), in_stock:true }
    await apiPost('/api/products', payload, { headers: { 'x-admin-token': token }})
    setForm({name:'', description:'', price:'', category:'Rings', image_url:''})
    await load()
  }

  return (
    <section className="bg-white text-slate-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <p className="text-sm text-slate-600 mb-6">Manage products using your admin token.</p>
        <div className="border rounded-xl p-4 mb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Admin token" className="border rounded-lg px-3 py-2 lg:col-span-5 bg-white text-slate-900"/>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="border rounded-lg px-3 py-2 bg-white text-slate-900"/>
            <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="border rounded-lg px-3 py-2 bg-white text-slate-900"/>
            <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" type="number" className="border rounded-lg px-3 py-2 bg-white text-slate-900"/>
            <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category" className="border rounded-lg px-3 py-2 bg-white text-slate-900"/>
            <input value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} placeholder="Image URL" className="border rounded-lg px-3 py-2 lg:col-span-2 bg-white text-slate-900"/>
            <button onClick={add} className="bg-slate-900 text-white rounded-lg px-4 py-2">Add Product</button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p=> (
            <div key={p.id} className="border rounded-xl p-4">
              <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover rounded"/>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-slate-500">₹{p.price}</p>
                </div>
                <a className="text-blue-600 text-sm underline" href={`mailto:support@navkarjewels.com?subject=Edit ${p.name}`}>Edit</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function App(){
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cart, setCart] = useState([])

  const addToCart = (p)=>{
    setCart(prev=>{
      const idx = prev.findIndex(x=>x.id===p.id)
      if(idx>-1){ const copy=[...prev]; copy[idx]={...copy[idx], qty: copy[idx].qty+1}; return copy }
      return [...prev, {...p, qty:1}]
    })
    setCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar cartCount={cart.reduce((s,i)=>s+i.qty,0)} onOpenCart={()=>setCartOpen(true)} />
      <Hero />
      <Catalog onAdd={addToCart} />
      <AdminPanel />
      <Footer />

      <CartDrawer open={cartOpen} items={cart} onClose={()=>setCartOpen(false)} onCheckout={()=>{setCartOpen(false); setCheckoutOpen(true)}} />
      <CheckoutModal open={checkoutOpen} items={cart} onClose={()=>{setCheckoutOpen(false); setCart([])}}/>
    </div>
  )
}
