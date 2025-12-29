'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import GenericButton from '@/components/generic/GenericButton'
import GenericText from '@/components/generic/GenericText'
import { SidebarTab } from './SidebarTab'
import type { NavigationItem } from '@/types/navigation.types'

interface Props {
  collapsed: boolean
  onClose: () => void
}

interface WindowWithLogoutFlag extends Window {
  __isLoggingOut?: boolean
}

export const SidebarNav: React.FC<Props> = ({ collapsed, onClose }) => {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(state => state.auth)
  const prevPathnameRef = useRef<string>(pathname)

  // Close sidebar on mobile when route changes (but not on initial mount)
  useEffect(() => {
    // Only close if pathname actually changed (not on initial mount)
    if (prevPathnameRef.current !== pathname && prevPathnameRef.current !== '') {
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && !collapsed) {
        onClose()
      }
    }
    prevPathnameRef.current = pathname
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]) // Only depend on pathname

  /**
   * Get all navigation items for admin panel
   * This function can be called iteratively to render tabs
   */
  const getNavigationItems = (): NavigationItem[] => {
    const currentPath = pathname

    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '📊',
        route: '/dashboard',
        active: currentPath === '/dashboard',
      },
      {
        id: 'stores',
        label: 'Stores',
        icon: '🏪',
        route: '/stores',
        active: currentPath === '/stores' || currentPath.startsWith('/stores/'),
      },
      {
        id: 'store-owners',
        label: 'Store Owners',
        icon: '👥',
        route: '/store-owners',
        active: currentPath === '/store-owners' || currentPath.startsWith('/store-owners/'),
        children: [
          {
            id: 'store-owners-list',
            label: 'All Store Owners',
            icon: '👤',
            route: '/store-owners',
            active: currentPath === '/store-owners',
          },
          {
            id: 'store-owners-invite',
            label: 'Invite Store Owner',
            icon: '✉️',
            route: '/store-owners/invite',
            active: currentPath === '/store-owners/invite',
          },
          {
            id: 'store-managers',
            label: 'Store Managers',
            icon: '👔',
            route: '/store-owners/managers',
            active: currentPath === '/store-owners/managers',
          },
        ],
      },
      {
        id: 'products',
        label: 'Products',
        icon: '📦',
        route: '/products',
        active: currentPath === '/products' || currentPath.startsWith('/products/'),
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: '🛒',
        route: '/orders',
        active: currentPath === '/orders' || currentPath.startsWith('/orders/'),
      },
      {
        id: 'templates',
        label: 'Templates',
        icon: '📧',
        route: '/templates',
        active: currentPath === '/templates' || currentPath.startsWith('/templates/'),
      },
    ]
  }

  const navigationItems = getNavigationItems()

  const handleLogout = async (): Promise<void> => {
    try {
      // Set a flag to prevent AuthInitializer from interfering
      if (typeof window !== 'undefined') {
        ;(window as WindowWithLogoutFlag).__isLoggingOut = true
      }

      await dispatch(logout())

      // Wait a moment to ensure cookies are cleared and state is updated
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          // Use window.location for full redirect to ensure it happens
          window.location.href = '/login'
        }
      }, 200)
    } catch (error) {
      // Even if logout fails, clear cookies and redirect
      console.error('Logout error:', error)
      if (typeof window !== 'undefined') {
        // Use dynamic import instead of require
        import('@/utils/cookies').then(({ clearAuthCookies }) => {
          clearAuthCookies()
          window.location.href = '/login'
        })
      }
    } finally {
      if (typeof window !== 'undefined') {
        ;(window as WindowWithLogoutFlag).__isLoggingOut = false
      }
    }
  }

  return (
    <nav className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
      <div className="flex-1 py-4">
        {/* Navigation Tabs */}
        <ul className="space-y-1 px-2">
          {navigationItems.map(item => (
            <SidebarTab key={item.id} item={item} collapsed={collapsed} onNavigate={onClose} />
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-200">
        <GenericButton
          variant="danger"
          size="md"
          type="button"
          className={`w-full flex items-center gap-3 ${
            collapsed ? '!justify-center' : '!justify-start'
          }`}
          aria-label="Logout"
          loading={loading}
          disabled={loading}
          onClick={handleLogout}
        >
          <span className="text-xl flex-shrink-0">🚪</span>
          {!collapsed && (
            <GenericText variant="span" size="md" weight="medium" color="text-white">
              Logout
            </GenericText>
          )}
        </GenericButton>
      </div>
    </nav>
  )
}
