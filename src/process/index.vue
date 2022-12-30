<template>
  <div class="process-info">
    <div class="process">
      <div class="menu">
        <div
          class="f-csp menu-item menu-item-boot-menu"
          @mousedown="startDragToGraph('bootMenu', $event)"
        >
          引导菜单
        </div>
        <div
          class="f-csp menu-item menu-item-dialogue-reply"
          @mousedown="startDragToGraph('dialogueReply', $event)"
        >
          回复消息
        </div>
        <div
          class="f-csp menu-item menu-item-transfer-to-labor"
          :disabled="transferToLaborDisabled"
          @mousedown="startDragToGraph('transferToLabor', $event)"
        >
          转人工
        </div>
        <dl>
          <tm-button @click="getData">获取数据</tm-button>
        </dl>
      </div>
      <div class="container" ref="containerRef"></div>
      <div v-if="!nodeData.length" class="empty">
        <div>开始配置你的服务流程吧</div>
        <div>鼠标点击左上方节点，同时按住鼠标左键拖动节点到画布中进行编辑</div>
      </div>
    </div>
    <boot-menu-editor
      v-model="bootMenuEditorVisible"
      :node-data="filterFn(nodeData)"
      :select-cell="selectCell"
      @confirm="handleBootMenuEditorConfirm"
    />
    <dialogue-reply-editor
      v-model="dialogueReplyEditorVisible"
      :node-data="filterFn(nodeData)"
      :select-cell="selectCell"
      :graph="graph"
      @confirm="handleEditorConfirm"
    />
    <transfer-to-labor-editor
      v-model="transferToLaborEditorVisible"
      :node-data="filterFn(nodeData)"
      :select-cell="selectCell"
      @confirm="handleEditorConfirm"
    />
  </div>
</template>

<script>
import '@antv/x6-vue-shape';
import { Graph, Shape, Addon, Path } from '@antv/x6';
import { startNodePorts, bootMenuPorts, bootMenuItemPorts, dialogueReplyPorts, transferToLaborPorts, nodeToolsConfig } from './graph/methods';
import StartNode from './components/startNode';
import BootMenu from './components/bootMenu/task';
import BootMenuEditor from './components/bootMenu/editor';
import BootMenuItem from './components/bootMenu/menuItem';
import DialogueReply from './components/dialogueReply/task';
import DialogueReplyEditor from './components/dialogueReply/editor';
import TransferToLabor from './components/transferToLabor/task';
import TransferToLaborEditor from './components/transferToLabor/editor';

Graph.registerConnector(
  'algo-connector',
  (s, e) => {
    const offset = 4
    const deltaY = Math.abs(e.y - s.y)
    const control = Math.floor((deltaY / 3) * 2)

    const v1 = { x: s.x, y: s.y + offset + control }
    const v2 = { x: e.x, y: e.y - offset - control }

    return Path.normalize(
      ` M ${s.x} ${s.y}
        L ${s.x} ${s.y + offset}
        C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
        L ${e.x} ${e.y}
      `
    )
  },
  true
)

export default {
  name: 'ProcessInfo',
  components: {
    BootMenuEditor,
    TransferToLaborEditor,
    DialogueReplyEditor
  },
  data () {
    return {
      menuList: [
        {
          name: '引导菜单',
          type: 'bootMenu'
        },
        {
          name: '回复消息',
          type: 'dialogueReply'
        },
        {
          name: '转人工',
          type: 'transferToLabor'
        }
      ],
      graph: null,
      selectCell: '',
      nodeData: [],
      nodeId: '',
      bootMenuEditorVisible: false,
      dialogueReplyEditorVisible: false,
      transferToLaborEditorVisible: false,
      transferToLaborDisabled: false,
      internalInfo: {}
    }
  },
  created () {
    this.$nextTick(() => {
      this.initAntvX6();
    });
  },
  beforeDestroy () {
    // this.internalInfo.nodeDetails = (this.graph.toJSON()).cells;
  },
  methods: {
    setNodeDetails () {
      // this.internalInfo.nodeDetails = (this.graph.toJSON()).cells;
    },
    initAntvX6 () {
      const self = this;
      const containerRef = this.$refs.containerRef;

      const graph = new Graph({
        container: containerRef, // 画布的容器
        selecting: true,
        snapline: true, // 对齐线
        history: true, // 启动历史记录
        background: {
          color: '#f4f4f6'
        },
        panning: true,
        allowLoop: false,
        interacting: (cellView) => {
          if (cellView.cell.getData() !== undefined && cellView.cell.getData().disabledMove) {
            return {
              nodeMovable: false
            }
          }
          return true;
        },
        // Scroller 使画布具备滚动、平移、居中、缩放等能力
        scroller: {
          enabled: true,
          pageVisible: true,
          pageBreak: true,
          pannable: true
        },
        // 鼠标滚轮的默认行为是滚动页面
        mousewheel: {
          enabled: true,
          modifiers: ['ctrl', 'meta'],
          minScale: 0.5,
          maxScale: 2
        },
        // 节点连接
        connecting: {
          anchor: 'center',
          connectionPoint: 'anchor',
          snap: true, // 自动吸附
          allowBlank: false, // 是否允许连接到画布空白位置的点
          allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
          allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
          allowMulti: false,
          sourceAnchor: 'bottom',
          highlight: true,
          createEdge () {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#D7D7D7',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'classic',
                    size: 8
                  },
                  strokeDasharray: 0, //虚线
                  style: {
                    animation: 'ant-line 30s infinite linear'
                  }
                }
              },
              label: {
                text: ''
              },
              connector: 'algo-connector',
              router: {
                name: 'orth'
              }
            })
          },
          // 点击 magnet 时 根据 validateMagnet 返回值来判断是否新增边，
          // 触发时机是 magnet 被按下，如果返回 false，则没有任何反应，
          // 如果返回 true，会在当前 magnet 创建一条新的边。
          // 当前输出链接桩已连接的数量大于定义的数量则不可创建新的边
          validateMagnet ({ magnet, cell }) {
            if (magnet.getAttribute('port-group') === 'in') {
              return false;
            }

            if (magnet.getAttribute('port-group') !== 'in') {
              let count = 0;
              const connectionCount = magnet.getAttribute('connection-count');
              const max = connectionCount ? parseInt(connectionCount, 10) : Number.MAX_SAFE_INTEGER;
              const outgoingEdges = graph.getOutgoingEdges(cell);
              if (outgoingEdges) {
                outgoingEdges.forEach(edge => {
                  const edgeView = graph.findViewByCell(edge);
                  if (edgeView.sourceMagnet === magnet) {
                    count += 1;
                  }
                });
              }
              return count < max;
            }

            return true;
          },
          validateConnection ({ sourceMagnet, targetMagnet }) {
            // 只能从输出链接桩创建连接
            if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
              return false;
            }
            // 只能连接到输入链接桩
            if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
              return false;
            }

            return true;
          },
          validateEdge ({ edge }) {
            const { source, target } = edge.store.data;
            // 开始节点不能直连转人工
            if (source.port.includes('start-node') && target.port.includes('transfer-to-labor')) return false;
            // 不能从子节点输出桩连到父节点输入桩
            if (source.port.includes(target.cell)) return false;
            return true;
          }
        },
        // 高亮
        highlighting: {
          magnetAvailable: {
            name: 'stroke',
            args: {
              attrs: {
                strokeWidth: 4,
                stroke: '#8872FB'
              }
            }
          }
        }
      })

      // // 注册 vue 组件
      Graph.registerVueComponent('start-node-component', {
        template: `<start-node></start-node>`,
        components: {
          StartNode
        }
      }, true)
      Graph.registerVueComponent('boot-menu-component', {
        template: `<boot-menu :node-data="nodeData"></boot-menu>`,
        components: {
          BootMenu
        },
        data () {
          return {
            nodeData: self.nodeData
          }
        }
      }, true)
      Graph.registerVueComponent('dialogue-reply-component', {
        template: `<dialogue-reply :node-data="nodeData"></dialogue-reply>`,
        components: {
          DialogueReply
        },
        data () {
          return {
            nodeData: self.nodeData
          }
        }
      }, true)
      Graph.registerVueComponent('transfer-to-labor-component', {
        template: `<transfer-to-labor :node-data="nodeData"></transfer-to-labor>`,
        components: {
          TransferToLabor
        },
        data () {
          return {
            nodeData: self.nodeData
          }
        }
      }, true)
      Graph.registerVueComponent('boot-menu-item-component', {
        template: `<boot-menu-item :node-data="nodeData"></boot-menu-item>`,
        components: {
          BootMenuItem
        },
        data () {
          return {
            nodeData: self.nodeData
          }
        }
      }, true)

      this.graph = graph;
      // 是否显示右则菜单
      this.graph.on('blank:click', () => {
        this.nodeId = '';
      })
      // 节点点击
      this.graph.on('node:click', ({ node }) => {
        const data = node.store.data;
        const { type, id } = data;
        if (type === 'bootMenuItem') {
          const cell = node.getParent();
          if (cell) {
            this.nodeId = cell.id;
            this.selectCell = cell;
            this.bootMenuEditorVisible = true;
          }
        } else if (type === 'bootMenu') {
          this.nodeId = id;
          this.bootMenuEditorVisible = true;
        } else if (type === 'dialogueReply') {
          this.nodeId = id;
          this.dialogueReplyEditorVisible = true;
        } else if (type === 'transferToLabor') {
          this.nodeId = id;
          this.transferToLaborEditorVisible = true;
        } else {
          this.nodeId = '';
          this.bootMenuEditorVisible = false;
          this.dialogueReplyEditorVisible = false;
          this.transferToLaborEditorVisible = false;
        }
      })
      // 连接线鼠标移入
      this.graph.on('edge:mouseenter', ({ edge, cell }) => {
        edge.removeLabelAt(0);
        edge.appendLabel('点击删除连接线');
        cell.setAttrs({
          line: {
            stroke: '#F67172'
          }
        });
      })
      // 连接线鼠标移出
      this.graph.on('edge:mouseleave', ({ edge, cell }) => {
        edge.removeLabelAt(0);
        cell.setAttrs({
          line: {
            stroke: '#D7D7D7'
          }
        });
      })
      // cell 节点时才触发
      this.graph.on('node:added', ({ node }) => {
        const data = node.store.data;
        if (data.type === 'bootMenu') {
          const obj = {
            id: data.id,
            ...data.data
          }
          this.nodeData.push(obj);
        }
        if (data.type === 'dialogueReply') {
          const obj = {
            id: data.id,
            ...data.data
          }
          this.nodeData.push(obj);
        }

        if (data.type === 'transferToLabor') {
          const obj = {
            id: data.id,
            ...data.data
          }
          this.nodeData.push(obj);
        }
      })
      this.graph.on('node:removed', ({ node }) => {
        const data = node.store.data;
        if (['bootMenu', 'dialogueReply', 'transferToLabor'].includes(data.type)) {
          this.nodeData = this.nodeData.filter(item => item.id !== data.id);
        }

        if (data.type === 'transferToLabor') {
          this.transferToLaborDisabled = false;
        }
      })
      this.graph.on('edge:connected', ({ edge }) => {
        const { source, target } = edge.store.data;
        if (target?.port?.includes('boot-menu')) {
          const bootMenuCell = this.graph.getCellById(target.cell);
          bootMenuCell.data.hasIncoming = true;
          for (const i of this.nodeData) {
            if (i.id === bootMenuCell.id) {
              i.hasIncoming = true;
            }
          }
        }
        if (source?.port.includes('boot-menu-item')) {
          const bootMenuItemCell = this.graph.getCellById(source.cell);
          const bootMenuCell = bootMenuItemCell.getParent();
          const { menuList } = bootMenuCell.data;
          const menuTypeIs1 = menuList.filter(menu => menu.type === 1);
          // 找出所有的输出边
          const outgoings = this.graph.getConnectedEdges(bootMenuCell, { deep: true, outgoing: true }) || [];
          bootMenuCell.data.hasEnoughOutgoing = menuTypeIs1.length === outgoings.length;

          for (const i of this.nodeData) {
            if (i.id === bootMenuCell.id) {
              i.hasEnoughOutgoing = menuTypeIs1.length === outgoings.length;
            }
          }
        }

        if (source?.port?.includes('start-node') && target?.port?.includes('dialogue-reply')) {
          const dialogueReplyCell = this.graph.getCellById(target.cell);
          dialogueReplyCell.data.fromStart = true;

          for (const i of this.nodeData) {
            if (i.id === dialogueReplyCell.id) {
              i.fromStart = true;
            }
          }
        }

        if (target?.port.includes('dialogue-reply')) {
          const dialogueReplyCell = this.graph.getCellById(target.cell);
          dialogueReplyCell.data.hasIncoming = true;
          for (const i of this.nodeData) {
            if (i.id === dialogueReplyCell.id) {
              i.hasIncoming = true;
            }
          }
        }

        if (target?.port.includes('transfer-to-labor')) {
          const transferToLaborCell = this.graph.getCellById(target.cell);
          transferToLaborCell.data.hasIncoming = true;
          for (const i of this.nodeData) {
            if (i.id === transferToLaborCell.id) {
              i.hasIncoming = true;
            }
          }
        }
      })
      this.graph.on('edge:removed', ({ cell }) => {
        const { source, target } = cell.store.data;
        if (target?.port?.includes('boot-menu')) {
          const bootMenuCell = this.graph.getCellById(target.cell);
          if (!bootMenuCell) return;
          bootMenuCell.data.hasIncoming = false;
          for (const i of this.nodeData) {
            if (i.id === bootMenuCell.id) {
              i.hasIncoming = false;
            }
          }
        }
        if (target?.port.includes('dialogue-reply')) {
          const dialogueReplyCell = this.graph.getCellById(target.cell);
          if (!dialogueReplyCell) return;
          dialogueReplyCell.data.hasIncoming = true;
          for (const i of this.nodeData) {
            if (i.id === dialogueReplyCell.id) {
              i.hasIncoming = false;
            }
          }
        }

        if (target?.port.includes('dialogue-reply')) {
          const isFormStart = source.port?.includes('start-node');
          const dialogueReplyCell = this.graph.getCellById(target.cell);
          if (!dialogueReplyCell) return;
          dialogueReplyCell.data.hasIncoming = false;
          if (isFormStart) {
            dialogueReplyCell.data.fromStart = false;
          }
          for (const i of this.nodeData) {
            if (i.id === dialogueReplyCell.id) {
              i.hasIncoming = false;
              if (isFormStart) {
                i.fromStart = false;
              }
            }
          }
        }

        if (target?.port.includes('transfer-to-labor')) {
          const transferToLaborCell = this.graph.getCellById(target.cell);
          if (!transferToLaborCell) return;
          transferToLaborCell.data.hasIncoming = false;
          for (const i of this.nodeData) {
            if (i.id === transferToLaborCell.id) {
              i.hasIncoming = false;
            }
          }
        }

        if (source?.port.includes('boot-menu-item')) {
          const bootMenuItemCell = this.graph.getCellById(source.cell);
          if (!bootMenuItemCell) return;
          const bootMenuCell = bootMenuItemCell.getParent();
          const { menuList } = bootMenuCell.data;
          const menuTypeIs1 = menuList.filter(menu => menu.type === 1);
          // 找出所有的输出边
          const outgoings = this.graph.getConnectedEdges(bootMenuCell, { deep: true, outgoing: true }) || [];
          bootMenuCell.data.hasEnoughOutgoing = menuTypeIs1.length === outgoings.length;

          for (const i of this.nodeData) {
            if (i.id === bootMenuCell.id) {
              i.hasEnoughOutgoing = menuTypeIs1.length === outgoings.length;
            }
          }
        }
      })
      this.graph.on('selection:changed', ({ added }) => {
        added.forEach(cell => {
          this.selectCell = cell;
        })

        const [cell = null] = added;
        // 如果点击的是一条边则删除
        if (cell && cell.isEdge()) {
          cell.remove();
        }
      })
      this.graph.clearCells();
      this.addNode();
    },
    // 拖拽节点新增
    startDragToGraph (type, e) {
      const graph = this.graph;
      let node = null;
      this.nodeId = '';

      // 验证 transferToLabor 是否已存在，只能添加一个
      if (type === 'transferToLabor' && this.transferToLaborDisabled) return;

      switch (type) {
        case 'bootMenu':
          node = graph.createNode({
            type: 'bootMenu',
            shape: 'vue-shape',
            x: 300,
            y: 300,
            width: 220,
            height: 94,
            ports: bootMenuPorts,
            data: {
              title: '引导菜单',
              message: '',
              menuList: [],
              hasIncoming: false,
              hasEnoughOutgoing: false
            },
            component: 'boot-menu-component',
            tools: nodeToolsConfig('#3470FF')
          })
          break
        case 'dialogueReply':
          node = graph.createNode({
            type: 'dialogueReply',
            shape: 'vue-shape',
            x: 300,
            y: 300,
            width: 220,
            height: 94,
            ports: dialogueReplyPorts,
            data: {
              title: '回复消息',
              message: '',
              hasIncoming: false,
              fromStart: false
            },
            component: 'dialogue-reply-component',
            tools: nodeToolsConfig()
          })
          break
        case 'transferToLabor':
          this.transferToLaborDisabled = true;
          node = graph.createNode({
            type: 'transferToLabor',
            shape: 'vue-shape',
            x: 300,
            y: 300,
            width: 200,
            height: 78,
            ports: transferToLaborPorts,
            data: {
              title: '转人工',
              hasIncoming: false
            },
            component: 'transfer-to-labor-component',
            tools: nodeToolsConfig('#53C086')
          })
          break
      }

      const dnd = new Addon.Dnd({ target: graph });
      dnd.start(node, e);
    },
    addNode () {
      const { internalInfo, graph } = this;
      if (internalInfo.nodeDetails?.length) {
        // 新增节点
        const nodeList = internalInfo.nodeDetails.filter(item => item.shape === 'vue-shape');
        graph.addNodes(nodeList);
        // 新增边
        const edgeList = internalInfo.nodeDetails.filter(item => item.shape === 'edge');
        graph.addEdges(edgeList);
        this.$nextTick(() => {
          this.checkHasTransferToLaborNode();
        });
        return;
      }
      this.addStartNode();
    },
    // 添加开始节点
    addStartNode () {
      const { offsetWidth } = this.$refs.containerRef;
      const graph = this.graph;
      console.log("caoyq0521 ~ file: index.vue:646 ~ addStartNode ~ graph", graph)
      graph.addNode({
        type: 'startNode',
        shape: 'vue-shape',
        x: offsetWidth / 2 - 98,
        y: 70,
        width: 196,
        height: 78,
        ports: startNodePorts,
        component: 'start-node-component'
      })
    },
    // 判断是否包含转人工节点
    checkHasTransferToLaborNode () {
      const { graph } = this;
      if (!graph) {
        this.transferToLaborDisabled = false;
        return;
      }
      const graphData = graph.toJSON();
      const transferToLaborNode = graphData.cells.find((item) => item.type === 'transferToLabor');
      this.transferToLaborDisabled = !!transferToLaborNode;
    },
    // 获取数据
    getData () {
      console.log(this.nodeData)
      console.log(this.graph)
      console.log(JSON.stringify(this.graph.toJSON()))
    },
    handleBootMenuEditorConfirm (id, info) {
      const { x, y } = this.selectCell.position();
      let children = this.selectCell.children;
      const { menuList = [] } = info;
      const list = [];

      if (children?.length) {
        this.selectCell.eachChild((cell) => {
          const { menuId } = cell.store.data.data;
          if (!menuList.find(menu => menu.menuId === menuId)) {
            list.push(cell);
          }
        });
      }
      if (list.length) {
        // 遍历当前子节点，如果菜单删除则删除相应的子节点
        list.forEach(item => item.removeFromParent())
        children = this.selectCell.children;
      }

      // 计算父节点宽度
      // 36: 左右padding 16
      // *4: 子节点间距
      const width = (menuList.length * 114) + (menuList.length - 1) * 4 + 36;
      const bootMenuWidth = width > 220 ? width : 220;
      this.selectCell.setProp('size', { width: bootMenuWidth, height: 94 });

      const { nodeData, graph } = this;
      for (let i of nodeData) {
        if (i.id === id) {
          i = Object.assign(i, info);
        }
      }

      let positionX = 0;

      for (let i = 0; i < menuList.length; i++) {
        const { menuId, name, type } = menuList[i];
        if (positionX) positionX += 120;
        else positionX += x + 16;

        const currentMenuIndex = children?.findIndex(cell => {
          const { menuId: cellMenuId } = cell.store.data.data;
          return cellMenuId === menuId;
        });
        if (currentMenuIndex > -1) {
        // 如果当前子节点存在，则更新name和节点位置
          const currentMenu = this.selectCell.getChildAt(currentMenuIndex);
          currentMenu.setProp({
            data: {
              name
            },
            x: positionX,
            y: y + 44
          });
          graph.resetCells(graph.getCells());
        } else {
          const child = graph.createNode({
            type: 'bootMenuItem',
            shape: 'vue-shape',
            x: positionX,
            y: y + 44,
            width: 114,
            height: 32,
            ports: bootMenuItemPorts,
            data: {
              menuId,
              name,
              disabledMove: true,
              type
            },
            component: 'boot-menu-item-component'
          })

          // 如果是回复菜单添加输出链接桩
          if (type === 1) {
            child.addPort({
              id: `boot-menu-item_${menuId}_${this.selectCell.id}`, // 处理父子节点连接
              group: 'out'
            });
          }
          this.selectCell.addChild(child);
        }
      }
    },
    handleEditorConfirm (id, info) {
      const { nodeData } = this;
      for (let i of nodeData) {
        if (i.id === id) {
          i = Object.assign(i, info);
        }
      }
    },
    // 过滤任务节点数据
    filterFn (data) {
      const nodeId = this.nodeId
      let result = {}

      if (nodeId && data.length > 0) {
        const posIndex = data.findIndex(item => item.id === nodeId)
        if (posIndex >= 0) {
          result = data[posIndex]
        }
      }

      return result
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep body {
  min-width: auto!important;
}

.process-info {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.process {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.menu {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  z-index: 99;

  &-item:not(:last-child) {
    margin-bottom: 10px;
  }

  &-item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    width: 104px;
    line-height: 36px;
    border-radius: 5px;
    overflow: hidden;

    &::before {
      content: ' ';
      width: 8px;
      height: 8px;
      margin-right: 10px;
      border-radius: 50%;
    }

    &-boot-menu {
      color: var(--main-color);
      background-color: #EAF0FF;

      &::before {
        background-color: var(--main-color);
      }
    }

    &-dialogue-reply {
      color: #FFB10B;
      background-color: #FFF6E3;

      &::before {
        background-color: #FFB10B;
      }
    }

    &-transfer-to-labor {
      color: #53C086;
      background-color: #F0F9EB;

      &::before {
        background-color: #53C086;
      }

      &[disabled] {
        color: #B2B4C7;
        background-color: #F4F4F6;
        cursor: not-allowed;

        &::before {
          background-color: #B2B4C7;
        }
      }
    }
  }
}

.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
  color: #858598;
  line-height: 24px;
}

.footer {
  display: flex;
  align-items: center;
  height: 66px;
  padding: 0 15px;
  background-color: #fff;
  border-top: 1px solid #D7D7D7;
}

.mini-map-container {
  position: fixed;
  z-index: 999;
  bottom: 20px;
  right: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .5);
}
</style>
