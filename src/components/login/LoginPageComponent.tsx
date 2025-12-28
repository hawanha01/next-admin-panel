'use client'

import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { LoginForm } from './LoginForm'
import type { LoginRequest } from '@/types/auth.types'

export const LoginPageComponent: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector(state => state.auth)

  const handleLogin = async (credentials: LoginRequest): Promise<void> => {
    try {
      const result = await dispatch(login(credentials))
      if (login.fulfilled.match(result)) {
        // Redirect to dashboard after successful login
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            router.push('/dashboard')
          }
        }, 300)
      }
    } catch (err) {
      // Error is handled by Redux
      console.error('Login error:', err)
    }
  }

  return <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
}
