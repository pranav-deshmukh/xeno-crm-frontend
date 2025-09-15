'use client'

import React from 'react';
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Shield, Award } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading your experience...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {session.user?.name}! 🎉
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Your personalized CRM dashboard is ready
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700 shadow-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">xeno</span>
          </div>
          
          

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              Sign in
            <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <section className="w-full px-6 py-20 bg-gradient-to-br  flex justify-center items-center">
        <div className="max-w-5xl flex justify-center items-center">
          <div className="space-y-10">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>AI Powered Customer Engagement Suite</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Maximise Repeat{' '}
                <span className="text-blue-600  bg-clip-text">
                  Revenue
                </span>{' '}
                with{' '}
                <span className=" text-blue-600 bg-clip-text">
                  10x easier
                </span>{' '}
                personalisation
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Unify customer data, generate insights, personalise marketing 
                communications across Email, SMS, WhatsApp & Instagram to delight 
                your loyal customers.
              </p>
            </div>
            
            

            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          
          
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">
            Trusted by Leading <span className="text-blue-600">Retailers & Restaurants</span>
          </h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of businesses that have transformed their customer engagement with Xeno
          </p>
          
          <div className="flex justify-center items-center space-x-12 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2 bg-gray-50 px-6 py-4 rounded-lg">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">TB</span>
              </div>
              <span className="font-semibold text-gray-700">TACO BELL</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-6 py-4 rounded-lg">
              <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">FN</span>
              </div>
              <span className="font-semibold text-gray-700">FOREVER NEW</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-6 py-4 rounded-lg">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">BS</span>
              </div>
              <span className="font-semibold text-gray-700">BESTSELLER</span>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-3xl font-bold mb-6">You are in <span className="text-blue-600">Good Hands</span></h3>
            <p className="text-xl text-gray-600 mb-12">
              Enterprise-grade security for your data&apos;s protection. Trusted by market leaders across 15+ categories.
            </p>
            
            <div className="flex justify-center items-center space-x-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">SOC 2</div>
                  <div className="text-sm text-gray-600">Certified</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-10 h-10 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">ISO 27001</div>
                  <div className="text-sm text-gray-600">Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">X</span>
                </div>
                <span className="text-xl font-bold">xeno</span>
              </div>
              <p className="text-gray-400">AI Powered Customer Engagement Suite</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Solutions</h4>
              <div className="space-y-3 text-gray-400">
                <div>Next Gen CRM</div>
                <div>Next Gen Loyalty</div>
                <div>Next Gen Offers</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Resources</h4>
              <div className="space-y-3 text-gray-400">
                <div>Retail Marketing Calendar</div>
                <div>Xeno Pulse</div>
                <div>Blogs</div>
                <div>Guides</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <div className="space-y-3 text-gray-400">
                <div>Careers</div>
                <div>Contact Us</div>
                <div>Get A Demo</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Xeno CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}