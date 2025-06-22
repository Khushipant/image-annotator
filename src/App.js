import React, { useState } from 'react';
import ImageGallery from './components/ImageGallery';
import CanvasBoxAnnotator from './components/CanvasBoxAnnotator';
import LabelSidebar from './components/LabelSidebar';
import LoginScreen from './components/LoginScreen'; // ✅ NEW
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ NEW

  const [unmarkedImages, setUnmarkedImages] = useState([]);
  const [markedImages, setMarkedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [currentLabel, setCurrentLabel] = useState(null);
  const [annotations, setAnnotations] = useState({});
  const [showLabelNames, setShowLabelNames] = useState(true);


  const markImage = (img, data) => {
    setMarkedImages((prev) => [...prev, img]);
    setUnmarkedImages((prev) => prev.filter((i) => i.url !== img.url));
    setAnnotations((prev) => ({ ...prev, [img.url]: data }));
  };

  const unmarkImage = (img) => {
    setMarkedImages((prev) => prev.filter((i) => i.url !== img.url));
    setUnmarkedImages((prev) => [...prev, img]);
  };

  // ✅ Show login screen first
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  // ✅ Show annotator only after login
  return (
    <div className="app-container">
      <div className="sidebar-left">
        <ImageGallery
          setCurrentImage={setCurrentImage}
          currentImage={currentImage}
          unmarkedImages={unmarkedImages}
          markedImages={markedImages}
          setUnmarkedImages={setUnmarkedImages}
          setMarkedImages={setMarkedImages}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
      </div>

      <div className="main-canvas">
        {currentImage && (
          <CanvasBoxAnnotator
            image={currentImage}
            label={currentLabel}
            boxes={annotations[currentImage.url] || []}
            setBoxes={(boxes) =>
              setAnnotations((prev) => ({ ...prev, [currentImage.url]: boxes }))
            }
            isMarked={markedImages.some((img) => img.url === currentImage?.url)}
            markImage={markImage}
            unmarkImage={unmarkImage}
            annotations={annotations}
            setAnnotations={setAnnotations}
          />
        )}
      </div>

      <div className="sidebar-right">
        <LabelSidebar
          labels={labels}
          setLabels={setLabels}
          currentLabel={currentLabel}
          setCurrentLabel={setCurrentLabel}
        />
      </div>
    </div>
  );
}

export default App;
