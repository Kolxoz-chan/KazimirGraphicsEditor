class Tool
{
	name = "";
	description = ""
	icon = null
	manager = null;

	setManager(manager)
	{
		this.manager = manager
	}
}

class SelectTool extends Tool
{	
	onClick(position)
	{
		alert(position.x + "x" + position.y)
	}
	
	onPress(position)
	{
		
	}
	
	onRelease(position)
	{
		
	}

	onMove(prev_pos, new_pos)
	{

	}
}

class CreatePrimitiveTool extends Tool
{	
	prefab = null;

	constructor(component, data = {})
	{
		super()
		this.prefab = new Prefab();
		this.prefab.addComponent("TransformComponent", {});
		this.prefab.addComponent("RectColiderComponent", {"coliding" : false});
		this.prefab.addComponent(this.component);
	}

	onClick(position)
	{
		let layer = Game.getObject(this.manager.current_layer)
		if(this.prefab && layer)
		{
			let obj = this.prefab.getEntity(this.data);
			obj.getComponent("TransformComponent").setPosition(position)
			layer.addChild(obj)
			this.manager.setObject(obj)
		}
	}

	onMove(prev_pos, new_pos)
	{
		let obj = this.manager.getObject()
		if(obj && this.manager.isPressed())
		{
			obj.getComponent("TransformComponent").grow(new_pos.sub(prev_pos))
		}
	}
}

class CreatePolygonTool extends CreatePrimitiveTool
{	
	prefab = null;

	constructor(component, data = {})
	{
		super()
		this.prefab = new Prefab();
		this.prefab.addComponent("TransformComponent", {});
		this.prefab.addComponent("RectColiderComponent", {"coliding" : false});
		this.prefab.addComponent(component);
	}

	onUpdate()
	{
		if(Input.isKeyClicked("Enter"))
		{
			let obj = this.manager.getObject()
			if(obj) obj.getComponent("DrawableComponent").deletePoint(-1)
			this.manager.setObject(null)
		}
	}

	onClick(position)
	{
		let obj = this.manager.getObject()
		if(!obj)
		{
			let layer = Game.getObject(this.manager.current_layer)
			if(this.prefab && layer)
			{
				obj = this.prefab.getEntity(this.data);
				obj.getComponent("TransformComponent").setPosition(position)
				obj.getComponent("DrawableComponent").addPoint(position)
				layer.addChild(obj)
				this.manager.setObject(obj)
			}
		}
		obj.getComponent("DrawableComponent").addPoint(position)
	}

	onMove(prev_pos, new_pos)
	{
		let obj = this.manager.getObject()
		if(obj) obj.getComponent("DrawableComponent").setPoint(-1, new_pos);
	}
}