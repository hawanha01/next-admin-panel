'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { clearError } from '@/store/slices/storeOwnerSlice'
import InviteStoreOwnerHeader from './InviteStoreOwnerHeader'
import InviteStoreOwnerForm from './InviteStoreOwnerForm'
import InviteStoreOwnerInfo from './InviteStoreOwnerInfo'

export default function InviteStoreOwnerPageComponent() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  return (
    <div className="max-w-2xl mx-auto">
      <InviteStoreOwnerHeader />
      <InviteStoreOwnerForm />
      <InviteStoreOwnerInfo />
    </div>
  )
}
