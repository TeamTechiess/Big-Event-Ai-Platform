import React from 'react'
import { Building2, Save, Download, Upload, Settings } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Event Management Platform
            </h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Floor Plan Editor
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="btn btn-outline flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Load</span>
            </button>
            <button className="btn btn-outline flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export PNG</span>
            </button>
            <button className="btn btn-primary flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button className="btn btn-outline">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
