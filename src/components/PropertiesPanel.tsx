import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { 
  Palette, 
  Move, 
  RotateCw, 
  Square, 
  Type,
  Trash2,
  Copy,
  Layers
} from 'lucide-react'

interface PropertiesPanelProps {
  object: fabric.Object
  canvas: fabric.Canvas | null
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ object, canvas }) => {
  const [properties, setProperties] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 1,
    opacity: 1,
    fontSize: 16,
    fontFamily: 'Arial',
    text: '',
  })

  useEffect(() => {
    if (object) {
      setProperties({
        left: Math.round(object.left || 0),
        top: Math.round(object.top || 0),
        width: Math.round(object.width || 0),
        height: Math.round(object.height || 0),
        angle: Math.round(object.angle || 0),
        scaleX: Math.round((object.scaleX || 1) * 100) / 100,
        scaleY: Math.round((object.scaleY || 1) * 100) / 100,
        fill: object.fill as string || '#000000',
        stroke: object.stroke as string || '#000000',
        strokeWidth: object.strokeWidth || 1,
        opacity: Math.round((object.opacity || 1) * 100) / 100,
        fontSize: (object as any).fontSize || 16,
        fontFamily: (object as any).fontFamily || 'Arial',
        text: (object as any).text || '',
      })
    }
  }, [object])

  const updateProperty = (key: string, value: any) => {
    if (!object || !canvas) return

    setProperties(prev => ({ ...prev, [key]: value }))
    
    // Update the object
    object.set(key, value)
    canvas.renderAll()
  }

  const deleteObject = () => {
    if (!object || !canvas) return
    canvas.remove(object)
    canvas.renderAll()
  }

  const duplicateObject = () => {
    if (!object || !canvas) return
    object.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (object.left || 0) + 20,
        top: (object.top || 0) + 20,
      })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
    })
  }

  const bringToFront = () => {
    if (!object || !canvas) return
    canvas.bringToFront(object)
    canvas.renderAll()
  }

  const sendToBack = () => {
    if (!object || !canvas) return
    canvas.sendToBack(object)
    canvas.renderAll()
  }

  const isText = object.type === 'i-text' || object.type === 'text'
  const isShape = object.type === 'rect' || object.type === 'circle' || object.type === 'line'

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={duplicateObject}
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={deleteObject}
              className="p-1 text-red-600 hover:text-red-900"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {object.type?.toUpperCase()} • {object.name || 'Unnamed'}
        </p>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Position & Size */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Move className="h-4 w-4 mr-2" />
            Position & Size
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">X Position</label>
              <input
                type="number"
                value={properties.left}
                onChange={(e) => updateProperty('left', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Y Position</label>
              <input
                type="number"
                value={properties.top}
                onChange={(e) => updateProperty('top', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Width</label>
              <input
                type="number"
                value={properties.width}
                onChange={(e) => updateProperty('width', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Height</label>
              <input
                type="number"
                value={properties.height}
                onChange={(e) => updateProperty('height', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Rotation & Scale */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <RotateCw className="h-4 w-4 mr-2" />
            Transform
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Rotation</label>
              <input
                type="number"
                value={properties.angle}
                onChange={(e) => updateProperty('angle', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Opacity</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={properties.opacity}
                onChange={(e) => updateProperty('opacity', parseFloat(e.target.value) || 1)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        {(isShape || isText) && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Fill Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={properties.fill}
                    onChange={(e) => updateProperty('fill', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={properties.fill}
                    onChange={(e) => updateProperty('fill', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Stroke Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={properties.stroke}
                    onChange={(e) => updateProperty('stroke', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={properties.stroke}
                    onChange={(e) => updateProperty('stroke', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Stroke Width</label>
                <input
                  type="number"
                  min="0"
                  value={properties.strokeWidth}
                  onChange={(e) => updateProperty('strokeWidth', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Text Properties */}
        {isText && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Text
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Text Content</label>
                <textarea
                  value={properties.text}
                  onChange={(e) => updateProperty('text', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                <input
                  type="number"
                  min="8"
                  value={properties.fontSize}
                  onChange={(e) => updateProperty('fontSize', parseFloat(e.target.value) || 16)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Font Family</label>
                <select
                  value={properties.fontFamily}
                  onChange={(e) => updateProperty('fontFamily', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Layer Controls */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Layer
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={bringToFront}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Bring to Front
            </button>
            <button
              onClick={sendToBack}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Send to Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPanel
