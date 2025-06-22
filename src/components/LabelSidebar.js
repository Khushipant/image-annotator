import React, { useState } from 'react';
import { useEffect } from 'react';
const predefinedLabels = [
  'Micro cracks',
  'Mini cracks',
  'Nano cracks',
  'Dry soldering',
  'Hot soldering',
  'Grid finger',
  'Dead cell',
  'Point Soldering'
];

const defaultColors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000'
];

const LabelSidebar = ({ labels, setLabels, currentLabel, setCurrentLabel }) => {
  const [name, setName] = useState('');
  const [customColor, setCustomColor] = useState(defaultColors[labels.length % defaultColors.length]);

  

  const addLabel = () => {
    if (name.trim()) {
      const isDuplicate = labels.some(
        (lbl) => lbl.name.toLowerCase() === name.trim().toLowerCase()
      );
      if (isDuplicate) {
        alert("Label name must be unique.");
        return;
      }

      const usedColors = labels.map((lbl) => lbl.color.toLowerCase());
      const availableColors = defaultColors.filter(
        (c) => !usedColors.includes(c.toLowerCase())
      );

      const customIsUnused = !usedColors.includes(customColor.toLowerCase());
      const assignedColor =
        customIsUnused ? customColor : availableColors[0] || '#000000';

      setLabels([...labels, { name: name.trim(), color: assignedColor }]);
      setName('');
      setCustomColor(
        availableColors[1] || defaultColors[(labels.length + 1) % defaultColors.length]
      );
    }
  };
  useEffect(() => {
  if (labels.length === 0) {
    const initialized = predefinedLabels.map((name, index) => ({
      name,
      color: defaultColors[index % defaultColors.length],
    }));
    setLabels(initialized);
    setCustomColor(defaultColors[initialized.length % defaultColors.length]);
  }
}, []);


  const deleteLabel = (index) => {
    const toDelete = labels[index];
    const updated = labels.filter((_, i) => i !== index);
    setLabels(updated);
    if (currentLabel?.name === toDelete.name) {
      setCurrentLabel(null);
    }
  };

  const handleColorChange = (index, newColor) => {
    const updated = [...labels];
    updated[index].color = newColor;
    setLabels(updated);
    if (currentLabel?.name === updated[index].name) {
      setCurrentLabel(updated[index]);
    }
  };

  return (
    <div style={{ padding: '14px', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Labels</h3>

      {/* Label Creation Form */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Label name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addLabel();
          }}
          style={{
            padding: '6px 8px',
            fontSize: '14px',
            width: '120px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          style={{ width: '40px', height: '36px', border: 'none' }}
        />
        <button
          onClick={addLabel}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            backgroundColor: '#0288d1',
            color: '#fff',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>

      {/* Label List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {labels.map((lbl, i) => (
          <div
            key={i}
            onClick={() => setCurrentLabel(lbl)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: currentLabel?.name === lbl.name ? '#e0f7fa' : '#f9f9f9',
              border: currentLabel?.name === lbl.name ? '2px solid #0288d1' : '1px solid #ddd',
              borderRadius: '6px',
              padding: '10px 12px',
              boxShadow: currentLabel?.name === lbl.name ? '0 0 6px rgba(2, 136, 209, 0.4)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: lbl.color,
                  border: '1px solid #333',
                }}
              />
              <span style={{ fontWeight: 500, fontSize: '14px' }}>{lbl.name}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteLabel(i);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
                title="Delete label"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelSidebar;
