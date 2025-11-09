import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { X, Save, FolderOpen, Download, Upload, Trash2 } from 'lucide-react'
import { FloorPlanManager } from '../utils/floorPlanManager'
import { FloorPlan } from '../types/editor'

interface SaveLoadDialogProps {
  isOpen: boolean
  onClose: () => void
  canvas: fabric.Canvas | null
  mode: 'save' | 'load'
}

const SaveLoadDialog: React.FC<SaveLoadDialogProps> = ({ isOpen, onClose, canvas, mode }) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const floorPlanManager = FloorPlanManager.getInstance()

  useEffect(() => {
    if (isOpen) {
      setFloorPlans(floorPlanManager.getAllFloorPlans())
    }
  }, [isOpen])

  const handleSave = async () => {
    if (!canvas || !name.trim()) return

    setIsLoading(true)
    try {
      const savedPlan = floorPlanManager.saveFloorPlan(canvas, name, description)
      setFloorPlans(floorPlanManager.getAllFloorPlans())
      setName('')
      setDescription('')
      onClose()
    } catch (error) {
      console.error('Error saving floor plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoad = () => {
    if (!canvas || !selectedPlan) return

    setIsLoading(true)
    try {
      const success = floorPlanManager.loadFloorPlan(canvas, selectedPlan)
      if (success) {
        onClose()
      }
    } catch (error) {
      console.error('Error loading floor plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this floor plan?')) {
      floorPlanManager.deleteFloorPlan(planId)
      setFloorPlans(floorPlanManager.getAllFloorPlans())
    }
  }

  const handleExport = (planId: string) => {
    const jsonData = floorPlanManager.exportToJSON(planId)
    if (jsonData) {
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `floor-plan-${planId}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string
        const success = floorPlanManager.importFromJSON(jsonData)
        if (success) {
          setFloorPlans(floorPlanManager.getAllFloorPlans())
        }
      } catch (error) {
        console.error('Error importing floor plan:', error)
        alert('Error importing floor plan. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'save' ? 'Save Floor Plan' : 'Load Floor Plan'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {mode === 'save' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Plan Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter floor plan name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description (optional)..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Import/Export Controls */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <label className="btn btn-outline cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  {floorPlans.length} floor plan{floorPlans.length !== 1 ? 's' : ''} saved
                </div>
              </div>

              {/* Floor Plans List */}
              {floorPlans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No floor plans saved yet</p>
                  <p className="text-sm">Create and save your first floor plan to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {floorPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPlan === plan.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{plan.name}</h3>
                          {plan.description && (
                            <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {new Date(plan.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleExport(plan.id)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Export"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(plan.id)
                            }}
                            className="p-1 text-red-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={mode === 'save' ? handleSave : handleLoad}
            disabled={
              isLoading ||
              (mode === 'save' ? !name.trim() : !selectedPlan)
            }
            className="btn btn-primary flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{mode === 'save' ? 'Save' : 'Load'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveLoadDialog
