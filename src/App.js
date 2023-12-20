import React from 'react'
import Canvas from './Canvas'
import * as core from './CanvasObjects'

function App() {

  var verlet = new core.DrawableVerletSystem();
  var entities = new core.Scene();

  const chainDistance = 5;
  const lengthOfChain = 10;
  const chain1X = window.innerWidth 
  / chainDistance;
  const chain2X = (window.innerWidth * (chainDistance - 1)) 
  / chainDistance;
  const chainSeperation = 75;
  const chainChaos = 40;

  var firstEnd = 0;
  var secondEnd = 0;

  for(let i = 0; i < lengthOfChain; i++){
    var p = verlet.addPoint(chain1X + chainChaos * (Math.random() - 0.5),-10 + i * chainSeperation/2);
    if(i > 0){
      verlet.addConstraint(p,p - 1, chainSeperation);
    } else {
      verlet.getPoint(p).isStatic = true;
    }

    if(i == lengthOfChain - 1){
      firstEnd = p;
    }
  }
  
  for(let i = 0; i < lengthOfChain; i++){
    var p = verlet.addPoint(chain2X + chainChaos * (Math.random() - 0.5),-10 + i * chainSeperation/2);
    if(i > 0){
      verlet.addConstraint(p,p - 1, chainSeperation);
    } else {
      verlet.getPoint(p).isStatic = true;
    }

    if(i == lengthOfChain - 1){
      secondEnd = p;
    }
  }

  entities.addEntity(verlet);

  verlet.addConstraint(firstEnd, secondEnd, chain2X - chain1X);

  const draw = (ctx, frameCount) => {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.fillStyle = "black";

    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    entities.drawEntities(ctx);
  }
  
  const update = (frameCount) => {
    verlet.update();
  }

  return <Canvas draw={draw} update={update} options={'2d'}/>
}

export default App