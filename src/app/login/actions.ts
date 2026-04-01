'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getSiteURL } from '@/utils/url-helper'

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const actionType = formData.get('actionType') as string // 'login' or 'signup'
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phoneNumber = formData.get('phoneNumber') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!email || !password) {
    return { error: 'Please provide both email and password.' }
  }

  const supabase = await createClient()

  if (actionType === 'signup') {
    // 1. SIGN UP LOGIC
    if (!firstName || !lastName) {
       return { error: 'First name and Last name are required for new accounts.' }
    }
    
    if (password !== confirmPassword) {
      return { error: 'Passwords do not match.' }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber
        },
      }
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user && !data.session) {
      return { success: 'Success! Please check your email to verify your account.' }
    }
  } else {
    // 2. LOG IN LOGIC
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return { error: error?.message || 'Invalid login credentials.' }
    }
  }

  // 3. ROLE ROUTING (Both Login and auto-confirmed Signup)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication failed.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}

export async function googleLoginAction() {
  const supabase = await createClient()
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  // redirect gracefully throws error parsed by Next.js
  if (data?.url) {
    redirect(data.url)
  }

  if (error) {
    throw new Error(error.message || 'OAuth authentication failed')
  }
}
