import React from 'react';

const ImageGallery = ({
  unmarkedImages,
  markedImages,
  setUnmarkedImages,
  setMarkedImages,
  setCurrentImage,
  currentImage,
  annotations,
  setAnnotations,
}) => {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const loaded = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    const combined = [...unmarkedImages, ...loaded];
    setUnmarkedImages(combined);
    setCurrentImage(combined[0]);
  };

  const handleDelete = (imgToDelete) => {
    setUnmarkedImages(unmarkedImages.filter((img) => img.url !== imgToDelete.url));
    if (currentImage?.url === imgToDelete.url) {
      setCurrentImage(unmarkedImages[0] || null);
    }
  };

  const markAsAnnotated = (img) => {
    setUnmarkedImages(unmarkedImages.filter((i) => i.url !== img.url));
    setMarkedImages((prev) => [...prev, img]);
    setAnnotations((prev) => ({ ...prev, [img.url]: annotations[img.url] || [] }));
  };

  const unmark = (img) => {
    setMarkedImages(markedImages.filter((i) => i.url !== img.url));
    setUnmarkedImages((prev) => [...prev, img]);
    setCurrentImage(img);
  };

  return (
    <div style={{ padding: '14px', fontFamily: 'Arial, sans-serif' }}>
      <h3>Images</h3>

      <label style={uploadLabelStyle}>
        Upload Images
        <input type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
      </label>
       <hr/>

      <h4
        style={{

          backgroundColor: '#f0f0f0',
        
          borderRadius: '6px',
          marginBottom: '12px',
          fontSize: '16px',
          color: '#333',
        }}
      >
        Unmarked Images
      </h4>
       <hr/>


      <div style={galleryStyle}>
        {unmarkedImages.map((img, i) => (
          <div key={i} style={imgBoxStyle}>
            <div
              style={{
                ...imgWrapperStyle,
                border: currentImage?.url === img.url ? '2px solid #0288d1' : '2px solid #ccc',
              }}
              onClick={() => setCurrentImage(img)}
            >
              <img src={img.url} alt={img.name} style={imgStyle} />
              <button style={deleteBtnStyle} onClick={(e) => {
                e.stopPropagation();
                handleDelete(img);
              }}>×</button>
            </div>
            <div style={imgNameStyle}>{img.name}</div>
           
          </div>
        ))}
      </div>

      <h4
        style={{
          
          backgroundColor: '#f0f0f0',
          
          borderRadius: '6px',
          marginBottom: '12px',
          fontSize: '16px',
          color: '#333',
        }}
      >
        Marked Images
      </h4>
      <hr/>

      <div style={galleryStyle}>
        {markedImages.map((img, i) => (
          <div key={i} style={imgBoxStyle}>
            <div
              style={{ ...imgWrapperStyle, opacity: 0.8 }}
              onClick={() => setCurrentImage(img)} // ✅ Add this
            >
              <img src={img.url} alt={img.name} style={imgStyle} />
            </div>

            <div style={imgNameStyle}>{img.name}</div>
            {/* <button style={unmarkBtnStyle} onClick={() => unmark(img)}>
              Unmark
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles
const uploadLabelStyle = {
  display: 'inline-block',
  marginBottom: '12px',
  padding: '6px 12px',
  backgroundColor: '#0288d1',
  color: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

const galleryStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '20px',
};

const imgBoxStyle = {
  textAlign: 'center',
};

const imgWrapperStyle = {
  position: 'relative',
  height: '50px',
  width: 'auto',
  borderRadius: '4px',
  overflow: 'hidden',
  cursor: 'pointer',
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

const imgNameStyle = {
  fontSize: '12px',
  marginTop: '4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#555',
  maxWidth: '100px',
};

const deleteBtnStyle = {
  position: 'absolute',
  top: '2px',
  right: '2px',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  fontSize: '12px',
  cursor: 'pointer',
};

const markBtnStyle = {
  marginTop: '4px',
  fontSize: '11px',
  padding: '2px 8px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#4caf50',
  color: 'white',
  cursor: 'pointer',
};

const unmarkBtnStyle = {
  marginTop: '4px',
  fontSize: '11px',
  padding: '2px 8px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#f44336',
  color: 'white',
  cursor: 'pointer',
};

export default ImageGallery;
