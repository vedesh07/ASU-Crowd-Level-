import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', logger(console.log))
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

// Utility to generate random OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Utility to extract first name from email
function extractFirstName(email: string): string {
  const username = email.split('@')[0]
  // Handle various formats: first.last, firstname.lastname, firstlast
  const parts = username.split('.')
  if (parts.length > 1) {
    // Capitalize first part
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
  }
  // If no dot, try to extract reasonable first name
  const name = username.replace(/\d+/g, '') // Remove numbers
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// Send OTP endpoint
app.post('/make-server-964be997/auth/send-otp', async (c) => {
  try {
    const { email } = await c.req.json()
    
    if (!email || !email.endsWith('@asu.edu')) {
      return c.json({ error: 'Invalid ASU email address' }, 400)
    }

    const otp = generateOTP()
    const otpExpiry = Date.now() + 5 * 60 * 1000 // 5 minutes

    // Store OTP in KV store
    await kv.set(`otp:${email}`, {
      otp,
      expiresAt: otpExpiry,
      attempts: 0
    })

    // Here you would integrate with Google Gmail API to send the email
    // For now, we'll simulate it and log the OTP
    console.log(`OTP for ${email}: ${otp}`)
    
    // In a real implementation, you would send email via Gmail API:
    /*
    const emailContent = {
      to: email,
      subject: 'ASU Crowd Tracker - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8C1D40;">ASU Crowd Tracker</h2>
          <p>Your verification code is:</p>
          <h1 style="background: #FFC627; color: #000; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    }
    await sendEmailViaGmail(emailContent)
    */

    return c.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // Remove this in production - only for demo
      debug: { otp }
    })
  } catch (error) {
    console.log('Error sending OTP:', error)
    return c.json({ error: 'Failed to send OTP' }, 500)
  }
})

// Verify OTP endpoint
app.post('/make-server-964be997/auth/verify-otp', async (c) => {
  try {
    const { email, otp } = await c.req.json()
    
    if (!email || !otp) {
      return c.json({ error: 'Email and OTP are required' }, 400)
    }

    // Get stored OTP
    const storedData = await kv.get(`otp:${email}`)
    
    if (!storedData) {
      return c.json({ error: 'OTP not found or expired' }, 400)
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      await kv.del(`otp:${email}`)
      return c.json({ error: 'OTP has expired' }, 400)
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      await kv.del(`otp:${email}`)
      return c.json({ error: 'Too many failed attempts' }, 400)
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      // Increment attempts
      await kv.set(`otp:${email}`, {
        ...storedData,
        attempts: storedData.attempts + 1
      })
      return c.json({ error: 'Invalid OTP' }, 400)
    }

    // OTP is valid - create/get user
    const userId = email.replace('@asu.edu', '').replace(/[^a-zA-Z0-9]/g, '_')
    const firstName = extractFirstName(email)
    const lastName = email.includes('.') ? 
      email.split('@')[0].split('.').slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase()) : 
      'Student'

    const user = {
      id: userId,
      email,
      firstName,
      lastName,
      createdAt: Date.now(),
      lastLogin: Date.now()
    }

    // Store user data
    await kv.set(`user:${userId}`, user)
    
    // Clean up OTP
    await kv.del(`otp:${email}`)

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    })
  } catch (error) {
    console.log('Error verifying OTP:', error)
    return c.json({ error: 'Failed to verify OTP' }, 500)
  }
})

// Get user profile endpoint
app.post('/make-server-964be997/auth/profile', async (c) => {
  try {
    const { userId } = await c.req.json()
    
    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400)
    }

    const user = await kv.get(`user:${userId}`)
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    })
  } catch (error) {
    console.log('Error fetching profile:', error)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

// Health check
app.get('/make-server-964be997/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Default route
app.all('*', (c) => {
  return c.json({ error: 'Route not found' }, 404)
})

Deno.serve(app.fetch)