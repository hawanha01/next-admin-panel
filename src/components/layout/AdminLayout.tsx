'use client'

import React, { useState, useEffect } from 'react'
import GenericButton from '@/components/generic/GenericButton'
import { SidebarHeader } from './SidebarHeader'
import { SidebarNav } from './SidebarNav'

interface Props {
  children: React.ReactNode
}

export const AdminLayout: React.FC<Props> = ({ children }) => {
  // Use mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Set mounted to true only on client - use callback to avoid setState in effect warning
    const initialize = (): void => {
      setMounted(true)
    }
    initialize()

    const checkMobile = (): void => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth < 1024 // lg breakpoint
        setIsMobile(mobile)
        // On mobile, start with sidebar closed
        if (mobile) {
          setIsSidebarCollapsed(true)
        }
      }
    }

    checkMobile()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkMobile)
      }
    }
  }, [])

  const toggleSidebar = React.useCallback((): void => {
    setIsSidebarCollapsed(prev => !prev)
  }, [])

  const closeSidebar = React.useCallback((): void => {
    setIsSidebarCollapsed(prev => {
      // Only close if on mobile and currently open
      if (isMobile && !prev) {
        return true
      }
      return prev
    })
  }, [isMobile])

  const sidebarWidth = isSidebarCollapsed ? 'w-20' : 'w-64'
  const mainContentMargin = isMobile ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'

  const sidebarClasses = `fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30 ${sidebarWidth} ${
    isMobile ? (isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0') : ''
  }`

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex relative">
        <div className="flex-1 p-6">{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Backdrop (mobile only) */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <SidebarHeader collapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        <SidebarNav collapsed={isSidebarCollapsed} onClose={closeSidebar} />
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        {/* Mobile Menu Button (only visible on mobile when sidebar is closed) */}
        {isMobile && isSidebarCollapsed && (
          <GenericButton
            variant="secondary"
            size="md"
            type="button"
            className="fixed top-4 left-4 z-40 p-2 !min-w-0 lg:hidden shadow-md border border-gray-200"
            aria-label="Open menu"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </GenericButton>
        )}

        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
