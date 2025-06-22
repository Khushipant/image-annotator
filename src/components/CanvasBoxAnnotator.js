import React, { useRef, useEffect, useState } from 'react';

const CanvasBoxAnnotator = ({
  image,
  label,
  boxes,
  setBoxes,
  isMarked,
  markImage,
  unmarkImage,
  annotations,
  setAnnotations,
}) => {
  const canvasRef = useRef();
  const [imgObj, setImgObj] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [previewEnd, setPreviewEnd] = useState(null);


  useEffect(() => {
    const img = new Image();
    img.src = image.url;
    img.onload = () => {
      setImgObj(img);
      const canvasW = window.innerWidth - 500;
      const canvasH = window.innerHeight - 50;
      const centerX = (canvasW - img.width) / 2;
      const centerY = (canvasH - img.height) / 2;
      setOffset({ x: centerX, y: centerY });
    };

    if (annotations[image.url]) {
      setBoxes(annotations[image.url]);
    } else {
      setBoxes([]);
    }

    setHistory([]);
    setFuture([]);
  }, [image]);

  useEffect(() => {
  if (imgObj && drawing && start && previewEnd) {
    draw();
  }
}, [previewEnd]);


  useEffect(() => {
    if (imgObj) draw();
  }, [imgObj, boxes, scale, offset, start]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') setIsSpacePressed(true);
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setDragging(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getMouseCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offset.x) / scale,
      y: (e.clientY - rect.top - offset.y) / scale,
    };
  };

  const btnStyle = {
    padding: '6px 16px',
    fontSize: '14px',
    backgroundColor: '#0288d1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
    const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth - 500;
    canvas.height = window.innerHeight - 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);
    ctx.drawImage(imgObj, 0, 0);

    boxes.forEach((b) => {
      ctx.strokeStyle = b.label.color;
      ctx.fillStyle = b.label.color + '55';
      ctx.lineWidth = 2 / scale;
      ctx.strokeRect(b.x, b.y, b.width, b.height);
      ctx.font = `${14 / scale}px Arial`;
      ctx.fillStyle = b.label.color;
      ctx.fillText(b.label.name, b.x + 4, b.y - 4);
    });

    if (drawing && start && label && previewEnd) {

      const end = previewEnd;
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const w = Math.abs(end.x - start.x);
      const h = Math.abs(end.y - start.y);

      ctx.setLineDash([6 / scale]);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2 / scale;
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  const handleMouseDown = (e) => {
    if (isSpacePressed || e.button === 1 || e.button === 2) {
      setDragging(true);
      return;
    }

    if (!label || !imgObj || e.button !== 0) return;

    const pos = getMouseCoords(e);
    if (pos.x < 0 || pos.y < 0 || pos.x > imgObj.width || pos.y > imgObj.height) return;

    setStart(pos);
    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setOffset((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
      return;
    }

    if (drawing && start) {
  const end = getMouseCoords(e);
  setPreviewEnd(end);
}

  };

  const handleMouseUp = (e) => {
    if (drawing && start && label && imgObj) {
      const end = getMouseCoords(e);
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const w = Math.abs(end.x - start.x);
      const h = Math.abs(end.y - start.y);

      if (x >= 0 && y >= 0 && x + w <= imgObj.width && y + h <= imgObj.height) {
        const newBox = { x, y, width: w, height: h, label };
        setHistory((prevHistory) => [...prevHistory, boxes]);
        setFuture([]);
        setBoxes([...boxes, newBox]);

      }
     

    }
    setStart(null);
    setDrawing(false);
    setDragging(false);
    setPreviewEnd(null);

  };

  const handleWheel = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const beforeX = (mouseX - offset.x) / scale;
    const beforeY = (mouseY - offset.y) / scale;
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(10, Math.max(0.5, scale * zoomFactor));
    setScale(newScale);
    setOffset({
      x: mouseX - beforeX * newScale,
      y: mouseY - beforeY * newScale,
    });
  };

  const downloadAnnotatedImage = () => {
    if (!imgObj) return;
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    tempCanvas.width = imgObj.width;
    tempCanvas.height = imgObj.height;

    ctx.drawImage(imgObj, 0, 0);
    boxes.forEach((b) => {
      ctx.strokeStyle = b.label.color;
      ctx.fillStyle = b.label.color + '55';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, b.y, b.width, b.height);
     
      ctx.font = '14px Arial';
      ctx.fillStyle = b.label.color;
      ctx.fillText(b.label.name, b.x + 4, b.y - 4);
    });

    const link = document.createElement('a');
    link.download = `annotated_${image.name}`;
    link.href = tempCanvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#1e1e1e', paddingTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        <button
  onClick={() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setFuture((f) => [boxes, ...f]);
    setBoxes(prev);
  }}
  style={{
    padding: '6px 12px',
    backgroundColor: '#0288d1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }}
>
  Undo
</button>

      
        <button onClick={downloadAnnotatedImage} style={btnStyle}>Download Annotated Image</button>
        {!isMarked ? (
          <button
            onClick={() => {
              markImage(image, boxes);
              setAnnotations((prev) => ({ ...prev, [image.url]: boxes }));
            }}
            style={{ ...btnStyle, backgroundColor: '#4caf50' }}
          >
            Save as Marked
          </button>
        ) : (
          <button
            onClick={() => {
              unmarkImage(image);
              setBoxes([]);
            }}
            style={{ ...btnStyle, backgroundColor: '#f44336' }}
          >
            Unmark
          </button>
        )}
      </div>

      <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
        Tip: Hold <kbd>space</kbd> to move the canvas
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        onWheel={handleWheel}
        style={{
          background: '#222',
          display: 'block',
          margin: '0 auto',
          borderRadius: '6px',
          cursor: isSpacePressed ? (dragging ? 'grabbing' : 'grab') : 'crosshair',
          maxWidth: '100%',
          maxHeight: '90vh',
          boxShadow: '0 0 4px #000',
        }}
      />
    </div>
  );
};

export default CanvasBoxAnnotator;
