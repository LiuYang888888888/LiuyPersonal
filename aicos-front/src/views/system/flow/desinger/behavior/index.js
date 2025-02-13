// import addToolbarItem from "./addToolbarItem";
import deleteNodeAndEdge from "./deleteNodeAndEdge";
// import nodeSetting from "./nodeSetting";
import baseInteract from "./baseInteract";
import G6 from '@antv/g6';


// G6.registerBehavior(addToolbarItem.name, addToolbarItem.config)
G6.registerBehavior(deleteNodeAndEdge.name, deleteNodeAndEdge.config)
G6.registerBehavior(baseInteract.name, baseInteract.config)
