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

  static length(p1, p2){
    const x = p1.x - p2.x;
    const y = p1.y - p2.y;
    return Math.sqrt(x*x + y*y);
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
    this.color = "black";
  }
  
  preDraw(context) {
    context.setTransform(1, 0, 0, 1, this.position.x, this.position.y);
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

  static draw(context,x,y,radius,color = "black"){
    context.setTransform(1, 0, 0, 1, x, y);
    
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
  }
}

class Line extends Drawable{
  constructor(p1, p2, lineWidth){
    super(0,0);
    this.p1 = p1;
    this.p2 = p2;
    this.lineWidth = lineWidth;
  }

  onDraw(context) {        
        context.beginPath();

        context.moveTo(this.p1.x, this.p1.y);
        context.lineTo(this.p2.x, this.p2.y);

        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.color;
        context.stroke();

  }

  static draw(context, x1, y1, x2, y2, lWidth = 1, color = "black"){
      context.setTransform(1, 0, 0, 1, x1, y1);
      context.beginPath();

      context.moveTo(0, 0);
      context.lineTo(x2 - x1, y2 - y1);

      context.lineWidth = lWidth;
      context.strokeStyle = color;

      context.stroke();
  }
}

class KinematicEntity extends Entity {
  constructor(position) {
    super(position.x, position.y);
    this.velocity = new Vector2(0,0);
  }
}

class Point extends KinematicEntity {
  constructor(position, isStatic = false){
    super(position);
    this.oldPosition = new Vector2(position.x, position.y);
    this.isStatic = isStatic;
  }
}

class Constraint {
  constructor(p1, p2, length = -1){
    this.p1 = p1;
    this.p2 = p2;
    if(length == -1)
      this.length = Vector2.length(this.p1.position, this.p2.position);
    else
      this.length = length;
  }
}
class VerletSystem {
  constructor(){
    this.points = [];
    this.constraints = [];
    this.AIR_RESISTANCE = 0.96;
    this.GRAVITY = 0.6;
  }

  getPoint(i) {
    return this.points[i];
  }
  addPoint(x, y){
    this.points.push(new Point(new Vector2(x,y)));
    this.onAddPoint(x,y);
    return this.points.length - 1;
  }

  addConstraint(i1, i2, length = -1) {
    const constraint = new Constraint(this.points[i1], this.points[i2], length);
    this.constraints.push(constraint);
    this.onAddConstraint(i1, i2);
  }

  onAddPoint(){}

  onAddConstraint(){}

  constrain(){
    for(let constraint of this.constraints){
      let p1 = constraint.p1;
      let p2 = constraint.p2;

      const dx = p2.position.x - p1.position.x;
      const dy = p2.position.y - p1.position.y;

      var currentLength = Math.sqrt(dx * dx + dy * dy);
      var deltaLength = currentLength - constraint.length;
      var perc = deltaLength / currentLength * 0.5;
      var offsetX = perc * dx;
      var offsetY = perc * dy;

      if(!p1.isStatic)
      {
        p1.position.x += offsetX;
        p1.position.y += offsetY;
      }

      if(!p2.isStatic)
      {
        p2.position.x -= offsetX;
        p2.position.y -= offsetY;
      }
    }
  }

  updatePoints(){
    
    for(let p of this.points){
      if(!p.isStatic){
        p.velocity.x = (p.position.x - p.oldPosition.x) * this.AIR_RESISTANCE;
        p.velocity.y = (p.position.y - p.oldPosition.y) * this.AIR_RESISTANCE;
        p.oldPosition.x = p.position.x;
        p.oldPosition.y = p.position.y;
        p.position.x += p.velocity.x;
        p.position.y += p.velocity.y;
        p.position.y += this.GRAVITY;
      }
    }
  }

  update(){
    this.updatePoints();
    for(let i = 0; i < 3; i++){
      this.constrain();
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
    for(let point of this.points){
      Circle.draw(context, point.position.x, point.position.y, 5, "white");
    }

    for(let constraint of this.constraints){
      var p1 = constraint.p1.position;
      var p2 = constraint.p2.position;

      Line.draw(context, p1.x, p1.y, p2.x, p2.y, 5, "white");
    }
  }
}

export{
  DrawableVerletSystem,
  Scene,
  Circle,
  Vector2
}