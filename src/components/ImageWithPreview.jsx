import React, { useState } from 'react';

const ImageWithPreview = ({ src, alt, size = "50px", previewSize = "250px" }) => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Offset the preview so it doesn't appear exactly under the cursor
    setPosition({
      x: e.clientX + 20,
      y: e.clientY - 100, // Centers it slightly vertically
    });
  };

  return (
    <div className="d-inline-block position-relative">
      {/* Small Thumbnail */}
      <img
        src={src || 'https://via.placeholder.com/50'}
        alt={alt}
        className="rounded border shadow-sm"
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          cursor: 'zoom-in',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
      />

      {/* Floating Large Preview */}
      {hovered && src && (
        <div
          className="position-fixed shadow-lg border rounded bg-white p-1"
          style={{
            top: position.y,
            left: position.x,
            width: previewSize,
            height: previewSize,
            zIndex: 9999,
            pointerEvents: 'none', // Critical: Prevents flickering
            transition: 'opacity 0.2s ease',
          }}
        >
          <img
            src={src}
            alt="Large preview"
            className="w-100 h-100 rounded"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageWithPreview;