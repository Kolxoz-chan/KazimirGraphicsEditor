/* --- Init game -------------------------------------------------------  */
Game.init("game-block");
Game.settings.style = "border: 1px solid black;"
Game.resetSettings()
Game.setEventHandlers(['keydown', 'keyup', 'mousedown', 'mouseup', "mousemove"])

/* --- Init project -------------------------------------------------------  */
let level = new Entity("test_project")
level.addComponent(new ToolManagerComponent(), {"default_tool" : new CreatePolygonTool("SplineComponent"), "current_layer" : "test_layer"})
Game.addEntity(level);

let layer = new Entity("test_layer")
level.addChild(layer);

let ent = new Entity("player");
ent.addComponent(new TransformComponent());
ent.addComponent(new SplineComponent());
layer.addChild(ent)

/* --- Start game -------------------------------------------------------- */
Game.start();


let vec = Vector2.fromAngle(270)
//alert(vec.x + " " + vec.y)

