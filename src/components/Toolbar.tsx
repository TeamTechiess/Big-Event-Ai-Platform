import React from 'react'
import { 
  MousePointer2, 
  Square, 
  Circle, 
  Type, 
  RectangleHorizontal,
  Ruler,
  Plus,
  Minus,
  RotateCcw,
  Trash2,
  Grid3X3,
  Home,
  Save,
  FolderOpen,
  Download,
  Image,
  FileText
} from 'lucide-react'
import { ToolType } from '../types/editor'

interface ToolbarProps {
  selectedTool: ToolType
  onToolChange: (tool: ToolType) => void
  onAddText: () => void
  onAddRectangle: () => void
  onAddCircle: () => void
  onClearCanvas: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onToggleFurnitureLibrary: () => void
  onSave: () => void
  onLoad: () => void
  onExportPNG: () => void
  onExportSVG: () => void
  onToggleGrid: () => void
  showGrid: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  onToolChange,
  onAddText,
  onAddRectangle,
  onAddCircle,
  onClearCanvas,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFurnitureLibrary,
  onSave,
  onLoad,
  onExportPNG,
  onExportSVG,
  onToggleGrid,
  showGrid
}) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'wall', icon: RectangleHorizontal, label: 'Wall' },
    { id: 'room', icon: Square, label: 'Room' },
    { id: 'furniture', icon: Home, label: 'Furniture' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'measure', icon: Ruler, label: 'Measure' },
  ]

  return (
    <div className="flex flex-col items-center py-4 space-y-2">
      {/* Drawing Tools */}
      <div className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id as ToolType)}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
                selectedTool === tool.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={tool.label}
            >
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-300 my-2"></div>

      {/* Shape Tools */}
      <div className="space-y-2">
        <button
          onClick={onAddText}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Add Text"
        >
          <Type className="h-5 w-5" />
        </button>
        <button
          onClick={onAddRectangle}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Add Rectangle"
        >
          <Square className="h-5 w-5" />
        </button>
        <button
          onClick={onAddCircle}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Add Circle"
        >
          <Circle className="h-5 w-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-300 my-2"></div>

      {/* Zoom Controls */}
      <div className="space-y-2">
        <button
          onClick={onZoomIn}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Zoom In"
        >
          <Plus className="h-5 w-5" />
        </button>
        <button
          onClick={onZoomOut}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Zoom Out"
        >
          <Minus className="h-5 w-5" />
        </button>
        <button
          onClick={onResetZoom}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-300 my-2"></div>

      {/* Save/Load Tools */}
      <div className="space-y-2">
        <button
          onClick={onSave}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          title="Save Floor Plan"
        >
          <Save className="h-5 w-5" />
        </button>
        <button
          onClick={onLoad}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          title="Load Floor Plan"
        >
          <FolderOpen className="h-5 w-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-300 my-2"></div>

      {/* Export Tools */}
      <div className="space-y-2">
        <button
          onClick={onExportPNG}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Export as PNG"
        >
          <Image className="h-5 w-5" />
        </button>
        <button
          onClick={onExportSVG}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Export as SVG"
        >
          <FileText className="h-5 w-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-300 my-2"></div>

      {/* Action Tools */}
      <div className="space-y-2">
        <button
          onClick={onToggleFurnitureLibrary}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Furniture Library"
        >
          <Home className="h-5 w-5" />
        </button>
        <button
          onClick={onToggleGrid}
          className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
            showGrid 
              ? 'bg-primary-100 text-primary-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Toggle Grid"
        >
          <Grid3X3 className="h-5 w-5" />
        </button>
        <button
          onClick={onClearCanvas}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          title="Clear Canvas"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default Toolbar
