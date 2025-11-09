import React, { useRef, useEffect, useState } from 'react'
import { fabric } from 'fabric'
import Toolbar from './Toolbar'
import FurnitureLibrary from './FurnitureLibrary'
import PropertiesPanel from './PropertiesPanel'
import MeasurementTool from './MeasurementTool'
import SaveLoadDialog from './SaveLoadDialog'
import { ToolType } from '../types/editor'
import { exportCanvasToPNG, exportCanvasToSVG } from '../utils/floorPlanManager'

// Create grid pattern for canvas background
const createGridPattern = (size: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, size)
  ctx.lineTo(size, size)
  ctx.moveTo(size, 0)
  ctx.lineTo(size, size)
  ctx.stroke()
  
  return canvas
}

const FloorPlanEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [selectedTool, setSelectedTool] = useState<ToolType>('select')
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [showFurnitureLibrary, setShowFurnitureLibrary] = useState(false)
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [showGrid, setShowGrid] = useState(true)


  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
      })

      // Enable grid
      fabricCanvas.set('gridSize', 20)
      
      // Add grid pattern
      const gridSize = 20
      const gridPattern = new fabric.Pattern({
        source: createGridPattern(gridSize),
        repeat: 'repeat'
      })
      fabricCanvas.set('backgroundColor', gridPattern)
      
      fabricCanvasRef.current = fabricCanvas
      setCanvas(fabricCanvas)

      // Handle object selection
      fabricCanvas.on('selection:created', (e) => {
        setSelectedObject(e.selected?.[0] || null)
      })

      fabricCanvas.on('selection:updated', (e) => {
        setSelectedObject(e.selected?.[0] || null)
      })

      fabricCanvas.on('selection:cleared', () => {
        setSelectedObject(null)
      })

      // Cleanup
      return () => {
        fabricCanvas.dispose()
      }
    }
  }, [])

  const handleToolChange = (tool: ToolType) => {
    setSelectedTool(tool)
    
    if (canvas) {
      // Reset canvas state
      canvas.isDrawingMode = false
      canvas.selection = true
      
      switch (tool) {
        case 'wall':
          canvas.isDrawingMode = true
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
          canvas.freeDrawingBrush.width = 4
          canvas.freeDrawingBrush.color = '#374151'
          break
        case 'room':
          canvas.isDrawingMode = true
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
          canvas.freeDrawingBrush.width = 2
          canvas.freeDrawingBrush.color = '#3b82f6'
          break
        case 'text':
          canvas.isDrawingMode = false
          canvas.selection = true
          break
        default:
          canvas.isDrawingMode = false
          canvas.selection = true
      }
    }
  }

  const addText = () => {
    if (canvas) {
      const text = new fabric.IText('Click to edit', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 16,
        fill: '#374151'
      })
      canvas.add(text)
      canvas.setActiveObject(text)
      canvas.renderAll()
    }
  }

  const addRectangle = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        left: 200,
        top: 200,
        width: 100,
        height: 100,
        fill: 'transparent',
        stroke: '#6b7280',
        strokeWidth: 2
      })
      canvas.add(rect)
      canvas.setActiveObject(rect)
      canvas.renderAll()
    }
  }

  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        left: 300,
        top: 300,
        radius: 50,
        fill: 'transparent',
        stroke: '#6b7280',
        strokeWidth: 2
      })
      canvas.add(circle)
      canvas.setActiveObject(circle)
      canvas.renderAll()
    }
  }

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear()
      canvas.backgroundColor = '#ffffff'
      canvas.renderAll()
    }
  }

  const zoomIn = () => {
    if (canvas) {
      const zoom = canvas.getZoom()
      canvas.setZoom(Math.min(zoom * 1.1, 3))
    }
  }

  const zoomOut = () => {
    if (canvas) {
      const zoom = canvas.getZoom()
      canvas.setZoom(Math.max(zoom / 1.1, 0.1))
    }
  }

  const resetZoom = () => {
    if (canvas) {
      canvas.setZoom(1)
    }
  }

  const handleExportPNG = () => {
    if (canvas) {
      exportCanvasToPNG(canvas, 'floor-plan.png')
    }
  }

  const handleExportSVG = () => {
    if (canvas) {
      exportCanvasToSVG(canvas, 'floor-plan.svg')
    }
  }

  const toggleGrid = () => {
    if (canvas) {
      setShowGrid(!showGrid)
      if (showGrid) {
        canvas.set('backgroundColor', '#ffffff')
      } else {
        const gridPattern = new fabric.Pattern({
          source: createGridPattern(20),
          repeat: 'repeat'
        })
        canvas.set('backgroundColor', gridPattern)
      }
      canvas.renderAll()
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Toolbar */}
      <div className="w-16 bg-white shadow-sm border-r">
        <Toolbar
          selectedTool={selectedTool}
          onToolChange={handleToolChange}
          onAddText={addText}
          onAddRectangle={addRectangle}
          onAddCircle={addCircle}
          onClearCanvas={clearCanvas}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onToggleFurnitureLibrary={() => setShowFurnitureLibrary(!showFurnitureLibrary)}
          onSave={() => setShowSaveDialog(true)}
          onLoad={() => setShowLoadDialog(true)}
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          onToggleGrid={toggleGrid}
          showGrid={showGrid}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Container */}
        <div className="flex-1 bg-gray-50 p-4 overflow-auto">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden relative">
            <canvas ref={canvasRef} />
            <MeasurementTool canvas={canvas} isActive={selectedTool === 'measure'} />
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-white border-t px-4 py-2 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Tool: {selectedTool}</span>
            <span>Zoom: {canvas ? Math.round(canvas.getZoom() * 100) : 100}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Canvas: 1200 × 800</span>
            <span>Grid: 20px</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Furniture Library */}
      {showFurnitureLibrary && (
        <div className="w-80 bg-white shadow-sm border-l">
          <FurnitureLibrary canvas={canvas} />
        </div>
      )}

      {/* Properties Panel */}
      {selectedObject && (
        <div className="w-80 bg-white shadow-sm border-l">
          <PropertiesPanel object={selectedObject} canvas={canvas} />
        </div>
      )}

      {/* Save/Load Dialogs */}
      <SaveLoadDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        canvas={canvas}
        mode="save"
      />
      <SaveLoadDialog
        isOpen={showLoadDialog}
        onClose={() => setShowLoadDialog(false)}
        canvas={canvas}
        mode="load"
      />
    </div>
  )
}

export default FloorPlanEditor
