import React from 'react'
import Canvas from './Canvas'
import * as core from './CanvasObjects'

function App() {

  var verlet = new core.DrawableVerletSystem();
  var entities = new core.Scene();

  verlet.addPoint(10,100);
  verlet.addPoint(100,100);

  entities.addEntity(verlet);

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    entities.drawEntities(ctx);
  }
  
  return <Canvas draw={draw} options={'2d'}/>
}

export default App