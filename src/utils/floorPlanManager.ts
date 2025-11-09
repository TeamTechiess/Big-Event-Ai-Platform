import { fabric } from 'fabric'
import { FloorPlan } from '../types/editor'

export class FloorPlanManager {
  private static instance: FloorPlanManager
  private floorPlans: FloorPlan[] = []

  private constructor() {
    this.loadFromLocalStorage()
  }

  static getInstance(): FloorPlanManager {
    if (!FloorPlanManager.instance) {
      FloorPlanManager.instance = new FloorPlanManager()
    }
    return FloorPlanManager.instance
  }

  // Save floor plan
  saveFloorPlan(canvas: fabric.Canvas, name: string, description?: string): FloorPlan {
    const data = JSON.stringify(canvas.toJSON())
    const floorPlan: FloorPlan = {
      id: this.generateId(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      data
    }

    this.floorPlans.push(floorPlan)
    this.saveToLocalStorage()
    return floorPlan
  }

  // Load floor plan
  loadFloorPlan(canvas: fabric.Canvas, floorPlanId: string): boolean {
    const floorPlan = this.floorPlans.find(fp => fp.id === floorPlanId)
    if (!floorPlan) return false

    try {
      const data = JSON.parse(floorPlan.data)
      canvas.loadFromJSON(data, () => {
        canvas.renderAll()
      })
      return true
    } catch (error) {
      console.error('Error loading floor plan:', error)
      return false
    }
  }

  // Get all floor plans
  getAllFloorPlans(): FloorPlan[] {
    return [...this.floorPlans]
  }

  // Delete floor plan
  deleteFloorPlan(floorPlanId: string): boolean {
    const index = this.floorPlans.findIndex(fp => fp.id === floorPlanId)
    if (index === -1) return false

    this.floorPlans.splice(index, 1)
    this.saveToLocalStorage()
    return true
  }

  // Update floor plan
  updateFloorPlan(floorPlanId: string, canvas: fabric.Canvas, name?: string, description?: string): boolean {
    const floorPlan = this.floorPlans.find(fp => fp.id === floorPlanId)
    if (!floorPlan) return false

    const data = JSON.stringify(canvas.toJSON())
    floorPlan.data = data
    floorPlan.updatedAt = new Date()
    
    if (name) floorPlan.name = name
    if (description) floorPlan.description = description

    this.saveToLocalStorage()
    return true
  }

  // Export to JSON
  exportToJSON(floorPlanId: string): string | null {
    const floorPlan = this.floorPlans.find(fp => fp.id === floorPlanId)
    if (!floorPlan) return null

    return JSON.stringify(floorPlan, null, 2)
  }

  // Import from JSON
  importFromJSON(jsonData: string): boolean {
    try {
      const floorPlan = JSON.parse(jsonData) as FloorPlan
      floorPlan.id = this.generateId()
      floorPlan.createdAt = new Date()
      floorPlan.updatedAt = new Date()
      
      this.floorPlans.push(floorPlan)
      this.saveToLocalStorage()
      return true
    } catch (error) {
      console.error('Error importing floor plan:', error)
      return false
    }
  }

  // Private methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('floorPlans', JSON.stringify(this.floorPlans))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const data = localStorage.getItem('floorPlans')
      if (data) {
        this.floorPlans = JSON.parse(data)
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      this.floorPlans = []
    }
  }
}

// Export utility functions
export const exportCanvasToPNG = (canvas: fabric.Canvas, filename: string = 'floor-plan.png'): void => {
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 2
  })
  
  const link = document.createElement('a')
  link.download = filename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportCanvasToSVG = (canvas: fabric.Canvas, filename: string = 'floor-plan.svg'): void => {
  const svgData = canvas.toSVG()
  const blob = new Blob([svgData], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export const exportCanvasToPDF = async (canvas: fabric.Canvas, filename: string = 'floor-plan.pdf'): Promise<void> => {
  // This would require a PDF library like jsPDF
  // For now, we'll export as PNG and let the user convert if needed
  exportCanvasToPNG(canvas, filename.replace('.pdf', '.png'))
}
