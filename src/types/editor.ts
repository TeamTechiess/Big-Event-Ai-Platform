export type ToolType = 
  | 'select'
  | 'wall'
  | 'room'
  | 'furniture'
  | 'text'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'measure'

export interface FurnitureItem {
  id: string
  name: string
  category: string
  icon: string
  width: number
  height: number
  color?: string
}

export interface FloorPlan {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  data: string // JSON string of canvas data
}

export interface EditorState {
  selectedTool: ToolType
  canvas: any // fabric.Canvas
  selectedObject: any // fabric.Object
  showGrid: boolean
  gridSize: number
  zoom: number
}
