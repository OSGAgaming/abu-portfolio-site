import React, { useRef, useEffect } from 'react'
import useCanvas from './CanvasHook'

const Canvas = props => {
  
  const { draw, options, ...rest } = props
  const {context, ...otherOptions} = options
  const canvasRef = useCanvas(draw, context)
  
  return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas