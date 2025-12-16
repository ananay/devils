'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-charcoal-400 max-w-2xl mx-auto">
            Have a question or need assistance? We&apos;d love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass rounded-2xl p-8">
            <h2 className="font-serif text-2xl font-bold text-white mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === 'success' && (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-charcoal-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-charcoal-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="partnership">Business Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-charcoal-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500 resize-none"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 px-8 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold text-lg hover:from-burgundy-600 hover:to-burgundy-700 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="glass rounded-2xl p-8 mb-8">
              <h2 className="font-serif text-2xl font-bold text-white mb-6">Visit Our Location</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-burgundy-700/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Address</h3>
                    <p className="text-charcoal-400">666 Bourbon Street<br />New Orleans, LA 70116</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-burgundy-700/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Phone</h3>
                    <p className="text-charcoal-400">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-burgundy-700/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email</h3>
                    <p className="text-charcoal-400">cheers@devilsadvocate.bar</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-burgundy-700/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Hours</h3>
                    <p className="text-charcoal-400">
                      Mon-Thu: 5pm - 12am<br />
                      Fri-Sat: 5pm - 2am<br />
                      Sun: 6pm - 11pm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="glass rounded-2xl p-2 h-64">
              <div className="w-full h-full rounded-xl bg-charcoal-800 flex items-center justify-center">
                <p className="text-charcoal-500">Map placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





