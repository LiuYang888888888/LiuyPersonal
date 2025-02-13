import G6 from "@antv/g6";
import startFlowTask from "./startFlowTask";
import startTask from "./startTask";
import userTask from "./userTask";
import serviceTask from "./serviceTask";
import exclusiveGateway from "./exclusiveGateway";
import subProcess from "./subProcess";
import tasklinkline from "./taskLinkLine";
import visitTask from "./visitTask";
import pluginTask from "./pluginTask";
import endTask from "./endTask";

G6.registerNode('startFlowTask', startFlowTask, 'circle')
G6.registerNode('startTask', startTask, 'modelRect')
G6.registerNode('userTask', userTask, 'modelRect')
G6.registerNode('serviceTask', serviceTask, 'modelRect')
G6.registerNode('exclusiveGateway', exclusiveGateway, 'modelRect')
G6.registerNode('subProcess', subProcess, 'modelRect')
G6.registerNode('visitTask', visitTask, 'modelRect')
G6.registerNode('pluginTask', pluginTask, 'modelRect')
G6.registerNode('endTask', endTask, 'circle')

// G6.registerCombo('subProcess', subProcess, 'rect')

// 定义连接线
G6.registerEdge('tasklinkline', tasklinkline, 'polyline')
