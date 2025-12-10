import { useEffect, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { ChevronDown, Trash2, Plus, Minus, ShoppingBag, X } from "lucide-react"
import { MagneticButton } from "@/components/visuals/MagneticButton"
import { BrandLogo } from "@/components/visuals/BrandLogo"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useViewport } from "@/context/ViewportContext"

interface PremiumNavbarProps { currentPage?: string }
export function PremiumNavbar({ currentPage }: PremiumNavbarProps) {
  const { scrollY } = useScroll()
  const height = useTransform(scrollY, [0, 200], [84, 70])
  const boxShadow = useTransform(
    scrollY,
    [0, 200],
    ["none", "0 2px 20px rgba(88,101,242,0.15)"]
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clear } = useCart()
  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()
  const [productsOpen, setProductsOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const { isMobile, safeAreaTop } = useViewport()
  
  return (
    <motion.header
      style={{ height, paddingTop: safeAreaTop }}
      className="sticky top-0 z-40 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <motion.div style={{ boxShadow }} className="h-full">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="#home" className="group">
            <BrandLogo />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <div onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
            <DropdownMenu open={productsOpen} onOpenChange={setProductsOpen}>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 hover:text-foreground relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                Products <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
               <DropdownMenuContent align="start">
                 <DropdownMenuItem asChild><Link href="#studio/api">Prompt Studio</Link></DropdownMenuItem>
                 <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Generators</DropdownMenuSubTrigger>
                   <DropdownMenuSubContent>
                     <DropdownMenuItem asChild><Link href="#prompt-generator">Prompt Generator</Link></DropdownMenuItem>
                     <DropdownMenuItem asChild><Link href="#generator">Form-based Generator</Link></DropdownMenuItem>
                     <DropdownMenuItem asChild><Link href="#chat">Chat-based Generator</Link></DropdownMenuItem>
                   </DropdownMenuSubContent>
                 </DropdownMenuSub>
                 <DropdownMenuItem asChild><Link href="#templates/index">Templates</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link href="#integrations/index">Integrations</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
            <Link href="#marketplace" className="hover:text-foreground relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">Marketplace</Link>
            <Link href="#community" className="hover:text-foreground relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">Community</Link>
            <Link href="#pricing" className="text-foreground font-medium relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">Pricing</Link>
            <div onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
            <DropdownMenu open={resourcesOpen} onOpenChange={setResourcesOpen}>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 hover:text-foreground relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                Resources <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
               <DropdownMenuContent align="start">
                 <DropdownMenuItem asChild><Link href="#docs">Docs</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link href="#blog">Blog</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link href="#templates/index">Templates Library</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="#feedback">Feedback</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
            <div onMouseEnter={() => setCompanyOpen(true)} onMouseLeave={() => setCompanyOpen(false)}>
            <DropdownMenu open={companyOpen} onOpenChange={setCompanyOpen}>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 hover:text-foreground relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                Company <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild><Link href="#about">About</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="#careers">Careers</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="#contact">Contact</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </nav>
          <div className="flex items-center gap-2">
            {currentPage?.startsWith("marketplace") && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="relative" size={isMobile ? "icon" : "sm"}>
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-96 sm:w-[420px] p-0">
                <SheetHeader className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Shopping Cart
                    </SheetTitle>
                    {items.length > 0 && (
                      <Badge variant="secondary">{totalItems} item{totalItems !== 1 ? 's' : ''}</Badge>
                    )}
                  </div>
                </SheetHeader>
                
                <div className="flex flex-col h-[calc(100vh-80px)]">
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <AnimatePresence>
                      {items.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-center justify-center py-16 text-center"
                        >
                          <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                          <p className="text-sm text-muted-foreground mb-6">
                            Start adding products to your cart
                          </p>
                          <Button asChild>
                            <Link href="#marketplace">Browse Marketplace</Link>
                          </Button>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          {items.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex gap-4 p-4 border rounded-lg hover:border-primary/20 transition-colors group"
                            >
                              {/* Product Image */}
                              <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                                    <ShoppingCart className="h-6 w-6 text-primary/50" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                  {item.title}
                                </h4>
                                {item.category && (
                                  <Badge variant="outline" className="text-xs mb-2">
                                    {item.category}
                                  </Badge>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                  <div className="font-bold text-primary">
                                    ${(item.price * (item.quantity ?? 1)).toFixed(2)}
                                  </div>
                                  {item.quantity && item.quantity > 1 && (
                                    <span className="text-xs text-muted-foreground">
                                      ${item.price.toFixed(2)} × {item.quantity}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2 border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, (item.quantity ?? 1) - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="min-w-[2rem] text-center text-sm font-medium">
                                    {item.quantity ?? 1}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-destructive hover:text-destructive"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Cart Footer */}
                  {items.length > 0 && (
                    <div className="border-t bg-muted/30 p-6 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={clear}>
                          <X className="h-4 w-4 mr-2" />
                          Clear Cart
                        </Button>
                        <Button className="flex-1" asChild>
                          <Link href="#checkout">
                            Checkout
                          </Link>
                        </Button>
                      </div>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href="#marketplace">Continue Shopping</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            )}
            {isMobile ? (
              <>
                {currentPage?.startsWith("marketplace") && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="#prompts/create">Create</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="#login">Log In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="#signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <>
                {currentPage?.startsWith("marketplace") && (
                  <MagneticButton>
                    <Button variant="outline" className="relative overflow-hidden hover:shadow-[0_0_24px_rgba(88,101,242,0.35)]" asChild>
                      <Link href="#prompts/create">
                        <span className="absolute -inset-px rounded-md bg-[radial-gradient(circle_at_center,theme(colors.primary/20),transparent_60%)] opacity-0 group-hover:opacity-60 transition-opacity" />
                        <span className="relative">Create Prompt</span>
                      </Link>
                    </Button>
                  </MagneticButton>
                )}
                <MagneticButton>
                  <Button variant="ghost" className="relative overflow-hidden hover:shadow-[0_0_24px_rgba(88,101,242,0.25)]" asChild>
                    <Link href="#login">
                      <span className="absolute -inset-px rounded-md bg-[radial-gradient(circle_at_center,theme(colors.primary/15),transparent_60%)] opacity-0 group-hover:opacity-60 transition-opacity" />
                      <span className="relative">Log In</span>
                    </Link>
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button className="relative overflow-hidden hover:shadow-[0_0_28px_rgba(88,101,242,0.45)]">
                    <span className="absolute -inset-px rounded-md bg-[radial-gradient(circle_at_center,theme(colors.primary/30),transparent_60%)] opacity-40" />
                    <span className="relative">Sign Up</span>
                  </Button>
                </MagneticButton>
              </>
            )}
          </div>
        </div>
        {/* Mobile Nav */}
        <div className="container mx-auto px-4 md:hidden">
          <div className="flex items-center justify-between py-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="mt-8 space-y-6">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground mb-2">Products</div>
                    <div className="flex flex-col gap-2">
                      <Link href="#studio/api">Prompt Studio</Link>
                      <Link href="#generator">Generators</Link>
                      <Link href="#templates/index">Templates</Link>
                      <Link href="#integrations/index">Integrations</Link>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground mb-2">Explore</div>
                    <div className="flex flex-col gap-2">
                      <Link href="#marketplace">Marketplace</Link>
                      <Link href="#community">Community</Link>
                      <Link href="#pricing" className="font-medium text-foreground">Pricing</Link>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground mb-2">Resources</div>
                    <div className="flex flex-col gap-2">
                      <Link href="#docs">Docs</Link>
                      <Link href="#blog">Blog</Link>
                      <Link href="#templates/index">Templates Library</Link>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground mb-2">Company</div>
                    <div className="flex flex-col gap-2">
                      <Link href="#about">About</Link>
                      <Link href="#careers">Careers</Link>
                      <Link href="#contact">Contact</Link>
                    </div>
                  </div>
                  <div className="pt-4 border-t flex gap-2">
                    <Button variant="ghost" asChild className="flex-1">
                      <Link href="#login">Log In</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="#signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="link" size="sm" asChild>
              <Link href="#pricing" className="font-semibold">See Pricing</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}


