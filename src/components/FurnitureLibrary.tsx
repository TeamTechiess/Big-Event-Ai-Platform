import React, { useState } from 'react'
import { fabric } from 'fabric'
import { 
  Sofa, 
  Chair, 
  Table, 
  Bed, 
  Tv, 
  Lamp, 
  Plant, 
  Door, 
  Window,
  Search,
  X
} from 'lucide-react'
import { FurnitureItem } from '../types/editor'

interface FurnitureLibraryProps {
  canvas: fabric.Canvas | null
}

const FurnitureLibrary: React.FC<FurnitureLibraryProps> = ({ canvas }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const furnitureItems: FurnitureItem[] = [
    // Seating
    { id: 'sofa-1', name: '3-Seat Sofa', category: 'seating', icon: 'sofa', width: 200, height: 80, color: '#8B4513' },
    { id: 'chair-1', name: 'Dining Chair', category: 'seating', icon: 'chair', width: 50, height: 50, color: '#654321' },
    { id: 'chair-2', name: 'Office Chair', category: 'seating', icon: 'chair', width: 60, height: 60, color: '#4169E1' },
    
    // Tables
    { id: 'table-1', name: 'Dining Table', category: 'tables', icon: 'table', width: 120, height: 80, color: '#8B4513' },
    { id: 'table-2', name: 'Coffee Table', category: 'tables', icon: 'table', width: 100, height: 60, color: '#654321' },
    { id: 'table-3', name: 'Desk', category: 'tables', icon: 'table', width: 120, height: 60, color: '#2F4F4F' },
    
    // Bedroom
    { id: 'bed-1', name: 'Single Bed', category: 'bedroom', icon: 'bed', width: 100, height: 200, color: '#F5F5DC' },
    { id: 'bed-2', name: 'Double Bed', category: 'bedroom', icon: 'bed', width: 150, height: 200, color: '#F5F5DC' },
    { id: 'bed-3', name: 'King Bed', category: 'bedroom', icon: 'bed', width: 180, height: 200, color: '#F5F5DC' },
    
    // Electronics
    { id: 'tv-1', name: 'TV (32")', category: 'electronics', icon: 'tv', width: 80, height: 50, color: '#000000' },
    { id: 'tv-2', name: 'TV (55")', category: 'electronics', icon: 'tv', width: 120, height: 70, color: '#000000' },
    
    // Lighting
    { id: 'lamp-1', name: 'Table Lamp', category: 'lighting', icon: 'lamp', width: 20, height: 40, color: '#FFD700' },
    { id: 'lamp-2', name: 'Floor Lamp', category: 'lighting', icon: 'lamp', width: 20, height: 60, color: '#FFD700' },
    
    // Decor
    { id: 'plant-1', name: 'Potted Plant', category: 'decor', icon: 'plant', width: 30, height: 40, color: '#228B22' },
    
    // Architectural
    { id: 'door-1', name: 'Single Door', category: 'architectural', icon: 'door', width: 80, height: 8, color: '#8B4513' },
    { id: 'door-2', name: 'Double Door', category: 'architectural', icon: 'door', width: 160, height: 8, color: '#8B4513' },
    { id: 'window-1', name: 'Window', category: 'architectural', icon: 'window', width: 100, height: 8, color: '#87CEEB' },
  ]

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'seating', name: 'Seating' },
    { id: 'tables', name: 'Tables' },
    { id: 'bedroom', name: 'Bedroom' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'decor', name: 'Decor' },
    { id: 'architectural', name: 'Architectural' },
  ]

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      sofa: Sofa,
      chair: Chair,
      table: Table,
      bed: Bed,
      tv: Tv,
      lamp: Lamp,
      plant: Plant,
      door: Door,
      window: Window,
    }
    return iconMap[iconName] || Chair
  }

  const addFurnitureToCanvas = (item: FurnitureItem) => {
    if (!canvas) return

    const Icon = getIcon(item.icon)
    
    // Create a rectangle to represent the furniture
    const furniture = new fabric.Rect({
      left: 100,
      top: 100,
      width: item.width,
      height: item.height,
      fill: item.color || '#6b7280',
      stroke: '#374151',
      strokeWidth: 1,
      name: item.name,
      data: { type: 'furniture', itemId: item.id }
    })

    canvas.add(furniture)
    canvas.setActiveObject(furniture)
    canvas.renderAll()
  }

  const filteredItems = furnitureItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Furniture Library</h3>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search furniture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Furniture Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div
                key={item.id}
                onClick={() => addFurnitureToCanvas(item)}
                className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.width}×{item.height}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FurnitureLibrary
