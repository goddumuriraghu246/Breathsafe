import { useEffect } from 'react';

const ChatBot = () => {
  useEffect(() => {
    // Check if Voiceflow is already loaded
    if (window.voiceflow?.chat) {
      return;
    }

    // Load Voiceflow script
    const script = document.createElement('script');
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    script.type = "text/javascript";
    script.async = true;
    
    script.onload = () => {
      if (!window.voiceflow?.chat) {
        window.voiceflow.chat.load({
          verify: { projectID: '6562308b16bf4800078f71e1' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          }
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default ChatBot; 