import { useEffect } from 'react';

/**
 * ChatWidget Component
 * 
 * React wrapper for the ArmosaChatWidget JavaScript implementation.
 * The widget auto-initializes and displays a floating action button (FAB)
 * in the bottom-right corner of the page.
 * 
 * Features:
 * - Chat mode with message bubbles
 * - Avatar mode with voice interaction
 * - File upload support
 * - Authentication modal
 * - Brand colors: Blue (#2563EB), Gold (#FFB800), Green (#00C896)
 * 
 * Usage:
 * <ChatWidget apiUrl="/api/chat" voiceUrl="/api/voice" loginUrl="/api/login" />
 * 
 * Or simply:
 * <ChatWidget /> (will use default endpoints)
 */
export default function ChatWidget({ 
  apiUrl = '/chat',
  voiceUrl = '/voice', 
  loginUrl = '/login' 
}) {
  useEffect(() => {
    // Load the chat widget script
    const scriptId = 'armosa-chat-widget-script';
    
    // Avoid loading twice
    if (document.getElementById(scriptId)) {
      return;
    }

    // Create and append script tag
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = '/chat-widget.js';
    script.async = true;
    
    script.onload = () => {
      // Configure the widget with custom endpoints if provided
      if (window.armosaChatWidget) {
        // Update config if widget already exists
        window.armosaChatWidget.config.apiUrl = apiUrl;
        window.armosaChatWidget.config.voiceUrl = voiceUrl;
        window.armosaChatWidget.config.loginUrl = loginUrl;
      } else {
        // Widget will auto-initialize on DOMContentLoaded
        // If we're here after DOM is loaded, we might need to re-initialize
        console.warn('ArmosaChatWidget not initialized. Widget should auto-initialize on DOM load.');
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load chat widget script');
    };

    document.body.appendChild(script);

    // Cleanup: Remove script on unmount (optional)
    // Note: We don't remove the widget itself to maintain state across page navigation
    return () => {
      // Uncomment below if you want to remove the script on unmount
      // const scriptElement = document.getElementById(scriptId);
      // if (scriptElement) scriptElement.remove();
    };
  }, [apiUrl, voiceUrl, loginUrl]);

  // This component doesn't render anything itself
  // The widget is injected into the DOM via JavaScript
  return null;
}
