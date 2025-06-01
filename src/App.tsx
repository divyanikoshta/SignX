import React, { useEffect } from 'react';
import './App.css';
import PdfViewer from './components/PdfViewer';
import { trackPageView } from './analytics';

function App() {
  useEffect(() => {
    // Track page view when the app loads
    trackPageView(window.location.pathname);
  }, []);

  return (
    <div className="App">
      <PdfViewer />
    </div>
  );
}

export default App;
