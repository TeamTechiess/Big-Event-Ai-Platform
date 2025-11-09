import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

interface MeasurementToolProps {
  canvas: fabric.Canvas | null
  isActive: boolean
}

const MeasurementTool: React.FC<MeasurementToolProps> = ({ canvas, isActive }) => {
  const measurementRef = useRef<fabric.Line | null>(null)
  const isDrawingRef = useRef(false)

  useEffect(() => {
    if (!canvas || !isActive) return

    const handleMouseDown = (e: fabric.IEvent) => {
      if (!isActive) return
      
      const pointer = canvas.getPointer(e.e)
      isDrawingRef.current = true

      // Create measurement line
      measurementRef.current = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: '#ff0000',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        name: 'measurement'
      })

      canvas.add(measurementRef.current)
    }

    const handleMouseMove = (e: fabric.IEvent) => {
      if (!isActive || !isDrawingRef.current || !measurementRef.current) return

      const pointer = canvas.getPointer(e.e)
      const line = measurementRef.current

      // Update line end point
      line.set({
        x2: pointer.x,
        y2: pointer.y
      })

      canvas.renderAll()
    }

    const handleMouseUp = () => {
      if (!isActive || !isDrawingRef.current || !measurementRef.current) return

      isDrawingRef.current = false
      const line = measurementRef.current

      // Calculate distance
      const dx = line.x2! - line.x1!
      const dy = line.y2! - line.y1!
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Create text label for measurement
      const text = new fabric.Text(`${Math.round(distance)}px`, {
        left: (line.x1! + line.x2!) / 2,
        top: (line.y1! + line.y2!) / 2 - 10,
        fontSize: 12,
        fill: '#ff0000',
        fontFamily: 'Arial',
        selectable: false,
        evented: false,
        name: 'measurement-label'
      })

      canvas.add(text)
      canvas.renderAll()
      measurementRef.current = null
    }

    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)

    return () => {
      canvas.off('mouse:down', handleMouseDown)
      canvas.off('mouse:move', handleMouseMove)
      canvas.off('mouse:up', handleMouseUp)
    }
  }, [canvas, isActive])

  return null
}

export default MeasurementTool
