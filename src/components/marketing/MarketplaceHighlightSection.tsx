import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { useCart } from "@/context/CartContext"

const items = [
  { title: "Cold Email Pack", author: "@selly" , price: "$9", img: "https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop"},
  { title: "YouTube Script Kit", author: "@mediaflow" , price: "$12", img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop"},
  { title: "Support Macros", author: "@helpbot" , price: "$7", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop"},
  { title: "Product Hunt Launch", author: "@makers" , price: "$5", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"},
]

export function MarketplaceHighlightSection() {
  const { addItem } = useCart()
  return (
    <section id="market" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#1a1230] to-[#0b1220]" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Marketplace</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">Buy and sell proven prompt packs. Keep 90% of each sale.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <Card className="group h-full hover:-translate-y-1 transition-transform overflow-hidden relative">
                <div className="relative h-32 overflow-hidden">
                  <img src={it.img} alt={it.title} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
                <CardContent className="p-5">
                  <div className="mt-1 font-semibold">{it.title}</div>
                  <div className="text-sm text-white/60">by {it.author}</div>
                  <div className="mt-2 text-sm">{it.price}</div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`#marketplace/${encodeURIComponent(it.title.toLowerCase().replace(/\s+/g,'-'))}`}>View Details</Link>
                    </Button>
                    <Button size="sm" onClick={() => addItem({ id: it.title, title: it.title, price: Number(it.price.replace('$','')) || 0, imageUrl: it.img })}>Add to Cart</Button>
                  </div>
                </CardContent>
                {/* Hover Quick View */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute left-3 right-3 bottom-3 rounded-lg border bg-background/95 p-3 shadow-lg">
                    <div className="text-sm font-semibold mb-1">Quick View</div>
                    <div className="text-xs text-white/70 line-clamp-3">Curated prompt pack designed for higher CTR and faster iteration. Includes variants and guidelines.</div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {['Marketing','Email','A/B'].map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded border text-white/80">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link href="#marketplace">Explore Marketplace</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default MarketplaceHighlightSection


