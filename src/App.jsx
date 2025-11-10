import { useEffect, useState } from 'react'
import { ShoppingCart, Search, Shirt, Car } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.team}</p>
        <div className="mt-2">
          <span className="text-lg font-bold">₹ {product.price_inr.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <button onClick={() => onAdd(product)} className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
        <ShoppingCart size={18} /> Add to cart
      </button>
    </div>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [team, setTeam] = useState('all')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const url = new URL('/api/products', BACKEND_URL || window.location.origin.replace(':3000', ':8000'))
      if (category !== 'all') url.searchParams.set('category', category)
      if (team !== 'all') url.searchParams.set('team', team)
      const res = await fetch(url.toString())
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, team])

  const addToCart = (p) => {
    setCart((prev) => [...prev, p])
  }

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.team.toLowerCase().includes(query.toLowerCase())
  )

  const teams = [
    'all',
    'Red Bull Racing','Ferrari','Mercedes','McLaren','Aston Martin',
    'Alpine','Williams','RB','Kick Sauber','Haas'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl">
            <img src="/f1.svg" alt="F1" className="w-7 h-7" />
            F1 Store India
          </div>
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-full max-w-md">
            <Search size={18} className="text-gray-500" />
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search teams or items" className="bg-transparent outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5 py-0.5">{cart.length}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button onClick={()=>setCategory('all')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${category==='all'?'bg-black text-white':'bg-white'}`}>
            All
          </button>
          <button onClick={()=>setCategory('jersey')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${category==='jersey'?'bg-black text-white':'bg-white'}`}>
            <Shirt size={18}/> Jerseys
          </button>
          <button onClick={()=>setCategory('car_model')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${category==='car_model'?'bg-black text-white':'bg-white'}`}>
            <Car size={18}/> Car Models
          </button>
          <select value={team} onChange={(e)=>setTeam(e.target.value)} className="px-3 py-2 rounded-lg border bg-white">
            {teams.map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
        </section>

        <section className="md:hidden mb-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-500" />
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search teams or items" className="bg-transparent outline-none text-sm w-full" />
          </div>
        </section>

        {loading ? (
          <div className="text-center text-gray-500">Loading products…</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <ProductCard key={p.id || p._id} product={p} onAdd={addToCart} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        Prices shown in INR. Delivery across India.
      </footer>
    </div>
  )
}

export default App
