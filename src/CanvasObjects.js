import React, { useRef, useEffect } from 'react'

class Scene {
  constructor(){
    this.entities = [];
  }

  addEntity(entity){
    this.entities.push(entity);
  }

  drawEntities(context){
    for(let entity of this.entities){
      entity.draw(context);
    }
  }
}

class Vector2 {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

class Entity {
  constructor(x, y) {
    this.position = new Vector2(x,y);
  }

}

class Drawable extends Entity {
  constructor(x,y){
    super(x,y);
    this.alpha = 1;
    this.scale = 1;
    this.rotation = 0;
  }
  
  preDraw(context) {
    context.setTransform(1, 0, 0, 1, this.position.x, this.position.y);
    context.beginPath();
    context.rotate(this.rotation);
  }

  onDraw(context) {}

  postDraw(context){}

  draw(context){
    this.preDraw(context);
    this.onDraw(context);
    this.postDraw(context);
  }
}

class Circle extends Drawable{
  constructor(x,y, scale = 1){
    super(x,y);
    this.scale = scale;
  }

  onDraw(context){
    context.beginPath();
    context.arc(0, 0, this.scale, 0, 2 * Math.PI, false);
    context.fillStyle = this.color;
    context.fill();
  }
}

class Line extends Drawable{
  constructor(p1, p2, lineWidth){
    super(p1);
    this.p1 = p1;
    this.p2 = p2;
    this.lineWidth = lineWidth;
  }

  onDraw(context) {        
        this.rotation = this.getAngle();

        //this.rotation = this.getAngle();
        this.velocityY += this.gravity;
        context.beginPath();

        context.moveTo(this.p1.x, this.p1.y);
        context.lineTo(this.p2.x, this.p2.y);

        context.lineWidth = this.lineWidth;
        //c.strokeStyle = this.color;
        context.stroke();

  }
}

class KinematicEntity extends Entity {
  constructor(position, velocity) {
    super(position);
    this.velocity = velocity;
  }
}

class Point extends KinematicEntity {
  constructor(position, oldPosition, velocity, isStatic = false){
    super(position, velocity);
    this.oldPosition = oldPosition;
    this.isStatic = isStatic;
  }
}

class Constraint {
  constructor(p1, p2){
    this.p1 = p1;
    this.p2 = p2;
  }

  length(){
    return Math.length(this.points[0], this.points[1]);
  }
}
class VerletSystem {
  constructor(){
    this.points = [];
    this.constraints = [];
  }

  addPoint(x, y){
    this.points.push(new Point(new Vector2(x,y)));
    this.onAddPoint(x,y);
    return this.points.length - 1;
  }

  addConstraint(i1, i2){
    const constraint = Constraint(this.points[i1], this.points[i2]);
    this.constraints.push(constraint);
    this.onAddConstraint(i1, i2);
  }

  onAddPoint(){}

  onAddConstraint(){}

  constrain(){
    for(let constraint of this.constraints){
      const p1 = constraint.p1;
      const p2 = constraint.p2;

      const dx = p2.position.x - p1.position.x;
      const dy = p2.position.y - p2.position.y;

      var currentLength = Math.sqrt(dx * dx + dy * dy);
      var deltaLength = currentLength - this.constraints.length();
      var perc = deltaLength / currentLength * 0.5;
      var offsetX = perc * dx;
      var offsetY = perc * dy;

      if(!p1.isStatic)
      {
        p1.position.X += offsetX;
        p1.position.Y += offsetY;
      }

      if(!p2.isStatic)
      {
        p2.position.X += offsetX;
        p2.position.Y += offsetY;
      }
    }
  }

  updatePoints(){
    for(let p of this.points){
      if(!p.isStatic){
        p.velocity.X = (p.position.X - p.oldPosition.X) * 0.9;
        p.velocity.Y = (p.position.Y - p.oldPosition.Y) * 0.9;
        p.oldPosition.X = p.position.X;
        p.oldPosition.Y = p.position.Y;
        p.position.X += p.velocity.X;
        p.position.Y += p.velocity.Y;
      }
    }
  }
}

class DrawableVerletSystem extends VerletSystem {
  constructor(){
    super();
    this.drawables = [];
  }

  onAddPoint(x, y){
    this.drawables.push(new Circle(x, y, 5));
  }

  onAddConstraint(i1, i2){
    this.drawables.push(new Line(
      this.points[i1].position, 
      this.points[i2].position, 5));
  }

  draw(context){
    for(let drawable of this.drawables){
      drawable.draw(context);
    }
  }
}

export{
  DrawableVerletSystem,
  Scene,
  Circle,
  Vector2
}