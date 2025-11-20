import { LayoutDashboard, Workflow, Sparkles, TestTube, CreditCard, Settings, BarChart3, FileText, Users, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

type SellerSidebarProps = {
  className?: string
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '#dashboard/seller', key: 'overview' },
  { icon: Workflow, label: 'Prompt Lifecycle', href: '#dashboard/seller/prompt-lifecycle', key: 'lifecycle' },
  { icon: Sparkles, label: 'Prompt Studio', href: '#dashboard/seller/prompt-studio', key: 'studio' },
  { icon: TestTube, label: 'Testing Lab', href: '#dashboard/seller/testing', key: 'testing' },
  { icon: BarChart3, label: 'Analytics', href: '#dashboard/seller/analytics', key: 'analytics' },
  { icon: FileText, label: 'My Prompts', href: '#dashboard/seller/prompts', key: 'prompts' },
  { icon: CreditCard, label: 'Payouts', href: '#dashboard/seller/payouts', key: 'payouts' },
  { icon: Users, label: 'Customers', href: '#dashboard/seller/customers', key: 'customers' },
  { icon: Settings, label: 'Settings', href: '#dashboard/seller/settings', key: 'settings' },
  { icon: HelpCircle, label: 'Support', href: '#dashboard/seller/support', key: 'support' },
]

export function SellerSidebar({ className }: SellerSidebarProps) {
  const [activeKey, setActiveKey] = useState<string>('overview')

  useEffect(() => {
    const updateActiveKey = () => {
      const hash = window.location.hash
      if (hash.includes('prompt-lifecycle') || hash.includes('lifecycle')) {
        setActiveKey('lifecycle')
      } else if (hash.includes('prompt-studio') || hash.includes('studio')) {
        setActiveKey('studio')
      } else if (hash.includes('testing')) {
        setActiveKey('testing')
      } else if (hash.includes('analytics')) {
        setActiveKey('analytics')
      } else if (hash.includes('prompts') && !hash.match(/prompts\/[^/]+$/)) {
        // Only set active if it's the prompts list page, not a detail page
        setActiveKey('prompts')
      } else if (hash.includes('payouts')) {
        setActiveKey('payouts')
      } else if (hash.includes('customers')) {
        setActiveKey('customers')
      } else if (hash.includes('settings')) {
        setActiveKey('settings')
      } else if (hash.includes('support')) {
        setActiveKey('support')
      } else if (hash.includes('dashboard/seller')) {
        setActiveKey('overview')
      }
    }

    updateActiveKey()
    window.addEventListener('hashchange', updateActiveKey)
    return () => window.removeEventListener('hashchange', updateActiveKey)
  }, [])

  const handleClick = (href: string, key: string) => {
    setActiveKey(key)
    window.location.hash = href
  }

  return (
    <aside className={cn("w-64 border-r bg-card p-4 space-y-1", className)}>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeKey === item.key
          return (
            <Button
              key={item.key}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-primary/10 text-primary font-medium"
              )}
              onClick={() => handleClick(item.href, item.key)}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}

