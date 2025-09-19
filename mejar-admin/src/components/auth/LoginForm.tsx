'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { authService } from '@/lib/auth'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await authService.signIn(data.email, data.password)
      toast.success('Welcome back! Redirecting to dashboard...')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      toast.error('Please enter your email address first')
      return
    }
    
    try {
      await authService.resetPassword(email)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="card p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className={`form-input ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="form-label">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-input pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('rememberMe')}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          
          <button
            type="button"
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            onClick={() => {
              const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value
              handleForgotPassword(email)
            }}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
          <h3 className="text-sm font-medium text-primary-800 mb-2">Demo Access</h3>
          <p className="text-xs text-primary-600 mb-2">Use these credentials to try the demo:</p>
          <div className="text-xs text-primary-700 space-y-1">
            <div><strong>Email:</strong> demo@restaurant.com</div>
            <div><strong>Password:</strong> demo123</div>
          </div>
          <button
            type="button"
            className="mt-2 text-xs text-primary-600 hover:text-primary-700 underline"
            onClick={() => {
              reset({ email: 'demo@restaurant.com', password: 'demo123', rememberMe: false })
            }}
          >
            Fill demo credentials
          </button>
        </div>
      </form>
    </div>
  )
}