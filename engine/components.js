/* --------------------------------- Components  -------------------------------------- */

/* Character stats stats */
class ScoreComponent extends AttributeComponent 
{
	value = 0;
}

class LifeComponent extends AttributeComponent 
{
	max_value = 100;
	min_value = 0
	
	init()
	{
		if(!this.value) this.value = this.max_value
	}
}

class AwardComponent extends AttributeComponent 
{
	value = 100;
}

/* Transform component*/
class TransformComponent extends ComponentBase
{	
	position = new Vector2(0, 0);
	velocity = new Vector2(0, 0);
	size = new Vector2(0, 0);;
	axis = new Vector2(0.5, 0.5);
	angle = 0.0;
	
	update()
	{
		this.position = this.position.add(this.velocity);
		this.velocity = new Vector2(0, 0);
	}
	
	setPosition(x, y)
	{
		this.position = new Vector2(x, y);
	}
	
	setSize(vector)
	{
		this.size = vector;
	}
	
	setAngle(a)
	{
		this.angle = a;
	}
	
	setAxis(x, y)
	{
		this.axis = new Vector2(x, y);
	}
	
	getPosition()
	{
		return this.position;
	}
	
	getCenter()
	{
		return new Vector2(this.position.x+this.size.x/2, this.position.y+this.size.y/2)
	}
	
	getSize()
	{
		return this.size;
	}
	
	getAngle()
	{
		return this.angle;
	}
	
	getAxis()
	{
		return this.axis;
	}
	
	move(vector)
	{
		this.velocity = this.velocity.add(vector);
	}
	
	move_to(point, speed)
	{	
		let len = this.position.getDistance(point);
		if(len > 0)
		{
			let vector = this.position.getVectorTo(point)
			if(len <= speed) this.move(point.sub(this.position));  
			else this.move(vector.mul(speed));
		}
	}
	
	move_around(axis, angle)
	{	
		angle = Math.PI / 180 * angle;
		
		let point = new Vector2()
		point.x = (this.position.x - axis.x) * Math.cos(angle) - (this.position.y - axis.y) * Math.sin(angle) + axis.x;
		point.y = (this.position.x - axis.x) * Math.sin(angle) + (this.position.y - axis.y) * Math.cos(angle) + axis.y;
		
		this.move(point.sub(this.position))
	}
	
	scale(vec)
	{
		this.size.x *= vec.x;
		this.size.y *= vec.y;
	}

	grow(vec)
	{
		this.size.x += vec.x;
		this.size.y += vec.y;
	}
	
	rotate(a)
	{
		this.angle += a;
	}
	
	rotate_at(point)
	{
		let center = this.getCenter()
		let angle = center.getDirection(point)
		this.setAngle(angle)
	}
}

/* Rect shape */
class RectShapeComponent extends DrawableComponent
{	
	init()
	{	
		this.join("TransformComponent")
	}
	
	update()
	{		

		if(this.opacity > 0.0)
		{
			/* Get data */
			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			
			/* Settings */
			this.applyStyles();
			this.applyTransformation()
			
			/* Draw */
			Game.context.fillRect(position.x, position.y, size.x, size.y);
			if(this.line_width > 0.0) Game.context.strokeRect(position.x, position.y, size.x, size.y);
			
			/* Reset*/
			Game.context.resetTransform();
		}
	}
}

/* Image component */
class ImageComponent extends DrawableComponent
{
	texture = null;
	
	init()
	{	
		let transform = this.join("TransformComponent")
		if(!transform.size) 
		{
			let image = Resources.getTexture(this.texture)
			transform.setSize(new Vector2(image.width, image.height))
		}
	}
	
	update()
	{		
		if(this.texture && this.opacity > 0.0)
		{	
			/* Get data */
			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			let image = Resources.getTexture(this.texture)
			
			/* Settings */
			this.applyStyles();
			this.applyTransformation()
			
			/* Draw */
			Game.context.drawImage(image, position.x, position.y, size.x, size.y);
			if(this.line_width > 0.0) Game.context.strokeRect(position.x, position.y, size.x, size.y);
			
			/* Reset*/
			Game.context.resetTransform();
		}
	}
}

/* Text component */
class TextComponent extends DrawableComponent
{
	text = "";
	font = null
	outline = true;
	
	init()
	{	
		let transform = this.join("TransformComponent")
		if(!transform.size) 
		{
			this.applyStyles();
			let metrics = Game.context.measureText(this.text);
			transform.setSize(new Vector2(metrics.width, metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent))
		}
	}
	
	update()
	{		
		if(this.text.length && this.opacity > 0.0 && this.font)
		{	
			/* Get data */
			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			
			/* Settings */
			this.applyStyles();
			this.applyTransformation()
			
			/* Draw */
			Game.context.font = this.font;
			if(this.outline) Game.context.strokeText(this.text, position.x, position.y);
			Game.context.fillText(this.text, position.x, position.y);
			
			/* Reset*/
			Game.context.resetTransform();
		}
	}
}

/* Polygon component */
class PolygonComponent extends DrawableComponent
{
	points = []
	closed = false
	line_width = 1.0
	
	init()
	{	
		let transform = this.join("TransformComponent")
	}
	
	addPoint(point)
	{
		this.points.push(point)
	}

	deletePoint(index)
	{
		if(index < 0) index = this.points.length + index
		this.points.splice(index, 1);
	}
	
	setPoint(index, point)
	{
		if(index < 0) index = this.points.length + index
		this.points[index] = point;
	}
	
	update()
	{		
		if(this.opacity > 0 && this.points.length > 0)
		{	
			/* Get data */
/*			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			*/
			
			/* Settings */
			this.applyStyles();
			//this.applyTransformation()
			
			/* Draw */
			Game.context.beginPath();
			Game.context.moveTo(this.points[0].x, this.points[0].y);
			for(let i=1; i<this.points.length; i++)
			{
				Game.context.lineTo(this.points[i].x, this.points[i].y);
			}
			if(this.closed) Game.context.closePath();
			Game.context.fill();
			Game.context.stroke();
			
			/* Reset*/
			Game.context.resetTransform();
		}
	}
}

/* Spline component */
class SplineComponent extends PolygonComponent
{	
	test = true

	init()
	{	
		let transform = this.join("TransformComponent")
	}

	generateSpline()
	{
		let arr = [];

		if(this.points.length > 2)
		{
			for(let i=1; i<this.points.length - 1; i++) 
			{
				let new_arr = this.getSpline(this.points[i - 1], this.points[i], this.points[i + 1])
				arr = arr.concat(new_arr);
			}
		}

		if(this.closed)
		{

		}
		else
		{
			arr.unshift(this.points[0], this.points[0]);
			arr.push(this.points[this.points.length - 1], this.points[this.points.length - 1]);
		}

		return arr;
	}

	getSpline(a, b, c)
	{
		let arr = []

		// let dirA = a.getVectorTo(b).add(c.getVectorTo(b))
		let dirA = a.getVectorTo(b).add(c.getVectorTo(b)).toDirectionVector();
		let dirB = Vector2.fromAngle(dirA.getDirectionalAngle() - 90)

		if(this.test)
		{
			this.test = false
			console.log(Vector2.getAngle(a, b, c))
			setTimeout(() => {this.test = true}, 500)
		}

		let parallel = new Line(b, b.add(dirB))
		let lineA = new Line(a, a.add(dirA))
		let lineB = new Line(c, c.add(dirA))

		a = lineA.getIntersectsPoint(parallel);
		c = lineB.getIntersectsPoint(parallel);

		lineA = new Line(b, a);
		lineB = new Line(b, c);

		arr.push(lineA.getPart(0.4).p2)
		arr.push(b)
		arr.push(lineB.getPart(0.4).p2)

		/*
			arr.push(lineA.getPart(1.0).p2)
			arr.push(b)
			arr.push(lineB.getPart(1.0).p2)
		*/

		return arr;
	}
	
	update()
	{		
		if(this.opacity > 0  && this.points.length > 0)
		{	
			/* Get data */
/*			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			*/
			
			/* Settings */
			this.applyStyles();
			//this.applyTransformation()

			/* Draw */
			Game.context.beginPath();

			let arr = this.generateSpline();
			Game.context.moveTo(arr[0].x, arr[0].y);
			for(let i=1; i<arr.length; i += 3)
			{
				Game.context.bezierCurveTo(arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y, arr[i + 2].x, arr[i + 2].y);
			}

			/*for(let i=1; i<arr.length; i++)
			{
				Game.context.lineTo(arr[i].x, arr[i].y);
			}*/
			
			if(this.closed) Game.context.closePath();
			Game.context.fill();
			Game.context.stroke();

			for(let i=0; i<this.points.length; i++)
			{
				Game.context.beginPath();
				Game.context.fillStyle = 'red';
				Game.context.arc(this.points[i].x, this.points[i].y, 3, 0, 2 * Math.PI, false);
				Game.context.closePath();
				Game.context.fill();
				Game.context.stroke();
			}
			
			/* Reset*/
			Game.context.resetTransform();
		}
	}
}

/* Path Moving Component */
class PathMovingComponent extends ComponentBase
{
	path = [];
	speed = 50;
	current_point = 0;
	waiting = 0.0
	timer = 0.0
	
	init()
	{
		this.join("TransformComponent")
		this.timer = this.waiting
	}
	
	update()
	{
		let transform_component = this.joined["TransformComponent"]
		if(this.path.length)
		{
			let pos = transform_component.getPosition();
			let point = this.path[this.current_point];
			
			transform_component.move_to(point, this.speed * Time.delta_time)
			
			if(point.equals(pos)) 
			{
				this.timer -= Time.delta_time;
				if(this.timer <= 0)
				{
					this.timer = this.waiting
					this.current_point++;
				}
			}
			if(this.current_point >= this.path.length) this.current_point = 0;
		}
	}
}

/* Watcher Component */
class SoundComponent extends ComponentBase
{
	sound = null;
	autoplay = false;
	loop = false;
	
	play()
	{
		let audio = Resources.getAudio(this.sound)
		audio.currentTime=0;
		audio.play();
	}
}

/* Watcher Component */
class WatcherComponent extends ComponentBase
{
	target = null;
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		if(this.target)
		{
			let obj = Game.getObject(this.target)
			let self_component = this.joined["TransformComponent"]
			let target_component = obj.getComponent("TransformComponent")
			self_component.rotate_at(target_component.getCenter())
		}
	}
}

/* Mouse Watcher Component */
class MouseWatcherComponent extends ComponentBase
{	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		let self_component = this.joined["TransformComponent"]
		self_component.rotate_at(Input.getGlobalMouse())
	}
}

/* Round Moving Component */
class RoundMovingComponent extends ComponentBase
{
	speed = 50;
	axis = new Vector2(0, 0);
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		let transform_component = this.joined["TransformComponent"]	
		transform_component.move_around(this.axis, this.speed * Time.delta_time)
	}
}

class PursuerComponent extends ComponentBase
{
	speed = 50;
	target = null;
	min_radius = 0;
	middle_radius = 0;
	max_radius = 100;
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		if(this.target)
		{
			let obj = Game.getObject(this.target)
			let target_transform = obj.getComponent("TransformComponent")
			
			if(target_transform)
			{
				let transform_component = this.joined["TransformComponent"];
				
				let self_pos = transform_component.getPosition();
				let target_pos = target_transform.getPosition();
				
				let speed = Time.delta_time * this.speed;
				let distance = self_pos.getDistance(target_pos)
				
				if(distance < this.min_radius) transform_component.move_to(target_pos, -speed)
				else if(distance < this.middle_radius) return;
				else if(distance < this.max_radius) transform_component.move_to(target_pos, speed)
			}
		}
	}
}

class PlayerControlComponent extends ComponentBase
{
	controls = {};
	acceleration = 2.0
	running = false
		
	init()
	{
		this.join("TransformComponent")
		
		this.addControl("Run", ["ShiftLeft", "ShiftRight"]);
		this.addControl("GoAhead", ["KeyW", "ArrowUp"]);
		this.addControl("GoBack", ["KeyS", "ArrowDown"]);
		this.addControl("GoLeft", ["KeyA", "ArrowLeft"]);
		this.addControl("GoRight", ["KeyD", "ArrowRight"]);
	}
	
	addControl(action, buttons)
	{
		this.controls[action] = buttons;
	}
	
	update()
	{
		let transform_component = this.joined["TransformComponent"]
		let speed = Time.delta_time * 50;
		
		/* Acceleration */
		if(Input.isKeysPressed(this.controls["Run"])) 
		{
			this.running = true;
			speed *= this.acceleration;
		}
		else this.running = false;
		
		/* Moving */
		if(Input.isKeysPressed(this.controls["GoAhead"])) transform_component.move(new Vector2(0, -speed));
		if(Input.isKeysPressed(this.controls["GoBack"])) transform_component.move(new Vector2(0, speed));
		if(Input.isKeysPressed(this.controls["GoLeft"])) transform_component.move(new Vector2(-speed, 0));
		if(Input.isKeysPressed(this.controls["GoRight"])) transform_component.move(new Vector2(speed, 0));
		if(Input.isKeysPressed(["KeyQ"])) Game.setFullScreen(true);
	}
}

class CameraComponent extends ComponentBase
{	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		let transform_component = this.joined["TransformComponent"]
		Camera.setCenter(transform_component.getCenter())
	}
}

/* Rect colider component*/
class RectColiderComponent extends ColiderComponent
{	
	offset = new Rect(0, 0, 0, 0)

	init()
	{
		this.join("TransformComponent")
	}

	getRect()
	{
		let transform_component = this.joined["TransformComponent"]
		let position = transform_component.getPosition()
		let size = transform_component.getSize()

		return new Rect(position.x, position.y, size.x, size.y)
	}
	
	isContained(point)
	{
		let rect = this.getRect()
		return rect.isConteined(point)
	}
}


/* Circle colider component*/
class CircleColiderComponent extends ColiderComponent
{	
	radius = undefined
	offset = new Vector2(0, 0)
	
	init()
	{
		let size = this.join("TransformComponent").getSize()
		if(!this.radius) this.radius = Math.max(size.x, size.y) / 2;
	}

	getRect()
	{	
		let transform_component = this.joined["TransformComponent"];
		let center = transform_component.getCenter();
		
		let diameter = this.radius * 2;
		return new Rect(center.x - this.radius, center.y - this.radius, diameter, diameter);
	}
	
	isContained(point)
	{
		let transform_component = this.joined["TransformComponent"];
		let center = transform_component.getCenter();
		return point.getDistance(center) <= this.radius;
	}
}

/* Hiding after death component */
class GravityComponent extends ComponentBase
{
	vector = new Vector2(0, 0)
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		this.joined["TransformComponent"].move(this.vector.mul(Time.delta_time))
	}
}

/* Respawn component */
class RespawnComponent extends ComponentBase
{	
	time = 5.0;
	timer = undefined;
	position = undefined;

	init()
	{
		let transform = this.join("TransformComponent")
		this.join("LifeComponent")
		if(!this.position) this.position = transform.getPosition();
	}
	
	update()
	{
		let life = this.joined["LifeComponent"];
		if(life.isZero())
		{
			if(!this.timer) this.timer = this.time
			this.timer -= Time.delta_time;
			if(this.timer <= 0.0)
			{
				this.joined["TransformComponent"].setPosition(this.position.x, this.position.y);
				life.resetMax();
				this.timer = this.time;
			}
		}
	}
}

/* Hiding after death component */
class DissolveComponent extends TimerComponent
{
	max_time = undefined;
	
	init()
	{
		this.max_time = this.time
		this.join("DrawableComponent")
	}
	
	tic()
	{
		this.joined["DrawableComponent"].setOpacity(this.time / this.max_time)
	}
}

/* Cursore camera component */
class CursoreWatcherComponent extends ComponentBase
{	
	init()
	{
		this.join("TransformComponent")
	}

	update()
	{
		let transform = this.joined["TransformComponent"];
		let offset = transform ? transform.getPosition() : new Vector2(0, 0);
		Camera.setCenter(Input.getLocalMouse().add(offset))
	}
}

/* Temporary component */
class TemporaryComponent extends TimerComponent
{
	time = 5.0
	
	action()
	{
		this.owner.container.delete(this.owner)
	}
}

/* Score Indicator Spawner */
class ScoreIndicatorSpawnerComponent extends AttributeEventComponent
{	
	container = null
	prefab = null

	action(old_value, new_value)
	{
		let value = new_value - old_value
		let layer = Game.current_level.getLayer(this.container)
		let prefab = Resources.getPrefab(this.prefab)
		layer.addObject(prefab.getEntity({
			"TransformComponent" : {"position" : Input.getLocalMouse()},
			"TextComponent" : {"text" : String(value), "fill_color" : value > 0 ? new Color(0, 255, 0) : new Color(255, 0, 0)}}))
	}
}

/* Dead Disabler Component */
class DeadDisablerComponent extends DeadEventComponent
{	
	reversable = true
	enablers = []
	disablers = []
	
	revival_action()
	{
		if(this.reversable)
		{
			for(let i in this.enablers)
			{
				let component = this.owner.getComponent(this.enablers[i])
				if(component) component.setEnabled(false);
			}
			for(let i in this.disablers) 
			{
				let component = this.owner.getComponent(this.disablers[i])
				if(component) component.setEnabled(true);
			}
		}
	}
	
	dead_action()
	{
		for(let i in this.enablers)
		{
			let component = this.owner.getComponent(this.enablers[i])
			if(component) component.setEnabled(true);
		}
		for(let i in this.disablers) 
		{
			let component = this.owner.getComponent(this.disablers[i])
			if(component) component.setEnabled(false);
		}
	}
}