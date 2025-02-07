import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Mars3DView from './Mars3DView';

// Dummy elevation data (you can replace this with real data)
const dummyElevationData = Array(1024).fill(0).map(() => Math.random() * 0.5);

const App: React.FC = () => {
  const [zoom, setZoom] = useState(15);

  // React Spring animation for zoom
  const props = useSpring({
    scale: zoom,
    config: { tension: 200, friction: 20 },
  });

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 1, 5)); // Prevent zooming in too much
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom + 1); // Zoom out
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Mars 3D View</h1>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>

      {/* Animated div with scale effect */}
      <animated.div
        style={{
          transform: props.scale.to((s) => `scale(${s})`), // Ensure correct scaling transform
        }}
      >
        {/* Pass the Mars3DView component here */}
        <Mars3DView elevationData={dummyElevationData} />
      </animated.div>
    </div>
  );
};

export default App;
