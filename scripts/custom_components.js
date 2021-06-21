/* MouseSelectComponent */
class ToolManagerComponent extends MouseComponent
{	
	current_layer = null;
	current_object = null;
	current_tool = null;
	default_tool = null;

	init()
	{
		this.resetTool()
	}

	update()
	{
		super.update()
		if(this.current_tool)
		{
			if(this.current_tool.onUpdate) this.current_tool.onUpdate()
		}
	}
	
	setTool(obj)
	{
		if(obj)
		{
			obj.setManager(this);
			this.current_tool = obj;
		}
	}

	setObject(obj)
	{
		this.current_object = obj;
	}

	getTool()
	{
		return this.current_tool;
	}

	getObject()
	{
		return this.current_object;
	}

	getLayer()
	{
		return this.current_layer;
	}
	
	resetTool()
	{
		this.setTool(this.default_tool)
	}

	onClick(position)
	{
		if(this.current_tool)
		{
			if(this.current_tool.onClick) this.current_tool.onClick(position)
		}
	}
	
	onMove(last_pos, new_pos)
	{
		if(this.current_tool)
		{
			if(this.current_tool.onMove) this.current_tool.onMove(last_pos, new_pos)
		}
	}
	
	onPress(position)
	{
		if(this.current_tool)
		{
			if(this.current_tool.onPress) this.current_tool.onPress(position)
		}
	}
	
	onRelease(position)
	{
		if(this.current_tool)
		{
			if(this.current_tool.onRelease) this.current_tool.onRelease(position)
		}
	}
}