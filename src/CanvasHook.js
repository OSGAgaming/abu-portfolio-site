import React, { useRef, useEffect } from 'react'

const useCanvas = (draw, options = {}) => {
  
  const canvasRef = useRef(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext(options.context || '2d')
    let frameCount = 0
    let animationFrameId
    
    const render = () => {
      context.save();
      context.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
      context.restore();
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
  return canvasRef
}

export default useCanvas