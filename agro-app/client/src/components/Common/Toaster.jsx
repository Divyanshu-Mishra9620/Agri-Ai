import React from 'react'
import { Toaster } from 'react-hot-toast'

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      gutter={16}
      containerStyle={{
        marginTop: '2rem',
        marginRight: '2rem',
        zIndex: 9999,
      }}
      toastOptions={{
        duration: 6000,
        style: {
          fontSize: '15px',
          borderRadius: '20px',
          padding: '18px 24px',
          maxWidth: '420px',
          minHeight: '70px',
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.12),
            0 8px 16px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
          border: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px) saturate(200%)',
          color: '#1e293b',
          fontWeight: '500',
          lineHeight: '1.6',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: 'translateZ(0)',
          position: 'relative',
          overflow: 'hidden',
        },
        
        // Enhanced Success Toast
        success: {
          iconTheme: {
            primary: '#ffffff',
            secondary: '#10b981',
          },
          style: {
            background: `
              linear-gradient(135deg, 
                #10b981 0%, 
                #059669 30%, 
                #047857 70%, 
                #065f46 100%
              )
            `,
            color: '#ffffff',
            fontWeight: '600',
            letterSpacing: '0.4px',
            boxShadow: `
              0 25px 50px rgba(16, 185, 129, 0.35),
              0 12px 24px rgba(16, 185, 129, 0.25),
              0 6px 12px rgba(16, 185, 129, 0.2),
              inset 0 2px 0 rgba(255, 255, 255, 0.3),
              inset 0 -2px 0 rgba(0, 0, 0, 0.1)
            `,
            border: '1px solid rgba(16, 185, 129, 0.4)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            animation: 'successBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            position: 'relative',
          },
        },

        // Enhanced Error Toast
        error: {
          iconTheme: {
            primary: '#ffffff',
            secondary: '#ef4444',
          },
          style: {
            background: `
              linear-gradient(135deg, 
                #ef4444 0%, 
                #dc2626 30%, 
                #b91c1c 70%, 
                #991b1b 100%
              )
            `,
            color: '#ffffff',
            fontWeight: '600',
            letterSpacing: '0.4px',
            boxShadow: `
              0 25px 50px rgba(239, 68, 68, 0.35),
              0 12px 24px rgba(239, 68, 68, 0.25),
              0 6px 12px rgba(239, 68, 68, 0.2),
              inset 0 2px 0 rgba(255, 255, 255, 0.3),
              inset 0 -2px 0 rgba(0, 0, 0, 0.1)
            `,
            border: '1px solid rgba(239, 68, 68, 0.4)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            animation: 'errorShakeIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            position: 'relative',
          },
        },

        // Enhanced Loading Toast
        loading: {
          iconTheme: {
            primary: '#1f2937',
            secondary: '#fbbf24',
          },
          style: {
            background: `
              linear-gradient(135deg, 
                #fbbf24 0%, 
                #f59e0b 30%, 
                #d97706 70%, 
                #b45309 100%
              )
            `,
            color: '#1f2937',
            fontWeight: '600',
            letterSpacing: '0.4px',
            boxShadow: `
              0 25px 50px rgba(251, 191, 36, 0.35),
              0 12px 24px rgba(251, 191, 36, 0.25),
              0 6px 12px rgba(251, 191, 36, 0.2),
              inset 0 2px 0 rgba(255, 255, 255, 0.4),
              inset 0 -2px 0 rgba(0, 0, 0, 0.1)
            `,
            border: '1px solid rgba(251, 191, 36, 0.4)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            animation: 'loadingGlow 2.5s ease-in-out infinite',
            position: 'relative',
          },
        },

        // Enhanced Info/Warning Toast
        blank: {
          style: {
            background: `
              linear-gradient(135deg, 
                #6366f1 0%, 
                #4f46e5 30%, 
                #4338ca 70%, 
                #3730a3 100%
              )
            `,
            color: '#ffffff',
            fontWeight: '600',
            letterSpacing: '0.4px',
            boxShadow: `
              0 25px 50px rgba(99, 102, 241, 0.35),
              0 12px 24px rgba(99, 102, 241, 0.25),
              0 6px 12px rgba(99, 102, 241, 0.2),
              inset 0 2px 0 rgba(255, 255, 255, 0.3),
              inset 0 -2px 0 rgba(0, 0, 0, 0.1)
            `,
            border: '1px solid rgba(99, 102, 241, 0.4)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            animation: 'infoSlideIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative',
          },
        },
      }}
    />
  )
}

export default CustomToaster
