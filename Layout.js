import React from 'react';

export default function Layout({ children, currentPageName }) {
  // Pages that don't need any wrapper
  const fullScreenPages = ['Onboarding'];
  const isFullScreen = fullScreenPages.includes(currentPageName);

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary: 120 53 15;
          --primary-foreground: 255 255 255;
        }
        
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Safe area padding for mobile */
        .safe-area-top {
          padding-top: env(safe-area-inset-top, 0px);
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
      
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl shadow-slate-200/50">
        {children}
      </div>
    </div>
  );
}