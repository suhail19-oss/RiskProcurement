import React from 'react';

function Image() {
  return (
    <div className="relative w-full max-w-md mx-auto"> {/* Container - adjust max-w-md as needed */}
      {/* Static main image */}
      <img 
        src="/images/image.png" 
        alt="Main content" 
        className="w-full h-auto rounded-lg shadow-lg"
      />
      
      {/* Animated robot in top-right corner */}
      <img
        src="/images/waving-robot-new.png"
        alt="Waving robot"
        className="absolute -top-4 -right-4 w-16 h-16 animate-bounce" // Adjust size (w-16) and position (-top-4) as needed
      />
    </div>
  );
}

export default Image;