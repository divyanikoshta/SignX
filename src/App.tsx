import React from 'react';
import logo from './logo.svg';
import './App.css';
import PdfViewer from './components/PdfViewer';
import PdfTextRenderer from './components/PdfTextRenderer';
import FILE from './mock/samplefile';


function App() {
  return (
    <div className="App">
      <PdfViewer />
      {/* <PdfTextRenderer base64={FILE} /> */}
    </div>
  );
}

export default App;
