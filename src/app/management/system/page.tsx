'use client'

import { useState } from 'react'

export default function SystemTools() {
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookEvent, setWebhookEvent] = useState('order.created')
  const [webhookMessage, setWebhookMessage] = useState('')

  const [xmlContent, setXmlContent] = useState('')
  const [xmlResult, setXmlResult] = useState('')

  const runDiagnostics = async () => {
    setLoading(true)
    setOutput('')

    try {
      const response = await fetch('/api/internal/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      })

      const data = await response.json()
      setOutput(data.output || data.error)
    } catch (error) {
      setOutput(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testWebhook = async () => {
    setWebhookMessage('')

    try {
      const response = await fetch('/api/internal/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl, event: webhookEvent }),
      })

      const data = await response.json()
      setWebhookMessage(data.message || data.error)
    } catch (error) {
      setWebhookMessage(`Error: ${error}`)
    }
  }

  const parseXml = async () => {
    setXmlResult('')

    try {
      const response = await fetch('/api/internal/parse-xml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xml: xmlContent }),
      })

      const data = await response.json()
      setXmlResult(JSON.stringify(data.result, null, 2))
    } catch (error) {
      setXmlResult(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-charcoal-950">
      <div className="max-w-7xl mx-auto pt-8">
        <div className="mb-8">
          <a href="/management" className="text-charcoal-400 hover:text-gold-500 text-sm mb-2 inline-block">
            ← Back to Dashboard
          </a>
          <h1 className="font-serif text-4xl font-bold text-white">System Tools</h1>
          <p className="text-charcoal-400 mt-2">Server diagnostics and administration tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Server Diagnostics */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-serif text-xl font-semibold text-white mb-4">Server Diagnostics</h2>
            <p className="text-charcoal-400 text-sm mb-4">
              Run system commands for diagnostic purposes
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-300 mb-2">
                  Command
                </label>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="e.g., uptime, df -h, free -m"
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500 font-mono text-sm"
                />
              </div>

              <button
                onClick={runDiagnostics}
                disabled={loading || !command}
                className="px-6 py-3 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Running...' : 'Run Command'}
              </button>

              {output && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-charcoal-300 mb-2">
                    Output
                  </label>
                  <pre className="bg-charcoal-900 border border-charcoal-700 rounded-lg p-4 text-charcoal-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Webhook Testing */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-serif text-xl font-semibold text-white mb-4">Webhook Testing</h2>
            <p className="text-charcoal-400 text-sm mb-4">
              Test webhook endpoints for order notifications
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-300 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-300 mb-2">
                  Event Type
                </label>
                <select
                  value={webhookEvent}
                  onChange={(e) => setWebhookEvent(e.target.value)}
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white"
                >
                  <option value="order.created">Order Created</option>
                  <option value="order.shipped">Order Shipped</option>
                  <option value="order.completed">Order Completed</option>
                  <option value="user.registered">User Registered</option>
                </select>
              </div>

              <button
                onClick={testWebhook}
                disabled={!webhookUrl}
                className="px-6 py-3 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all disabled:opacity-50"
              >
                Test Webhook
              </button>

              {webhookMessage && (
                <div className={`mt-4 p-4 rounded-lg ${
                  webhookMessage.includes('Error') 
                    ? 'bg-red-500/10 border border-red-500/50 text-red-400' 
                    : 'bg-green-500/10 border border-green-500/50 text-green-400'
                }`}>
                  {webhookMessage}
                </div>
              )}
            </div>
          </div>

          {/* XML Parser */}
          <div className="glass rounded-xl p-6 lg:col-span-2">
            <h2 className="font-serif text-xl font-semibold text-white mb-4">XML Import Tool</h2>
            <p className="text-charcoal-400 text-sm mb-4">
              Parse XML data for bulk imports (products, orders, etc.)
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-300 mb-2">
                  XML Content
                </label>
                <textarea
                  value={xmlContent}
                  onChange={(e) => setXmlContent(e.target.value)}
                  rows={10}
                  placeholder={`<?xml version="1.0"?>
<order>
  <items>
    <item>
      <name>Product Name</name>
      <quantity>2</quantity>
    </item>
  </items>
</order>`}
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500 font-mono text-sm resize-none"
                />
                <button
                  onClick={parseXml}
                  disabled={!xmlContent}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all disabled:opacity-50"
                >
                  Parse XML
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-300 mb-2">
                  Parsed Result (JSON)
                </label>
                <pre className="h-64 bg-charcoal-900 border border-charcoal-700 rounded-lg p-4 text-charcoal-300 font-mono text-sm overflow-auto whitespace-pre-wrap">
                  {xmlResult || 'Parsed result will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





