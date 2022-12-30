// 引导菜单链接桩
export const bootMenuPorts = {
  groups: {
    // 输入链接桩群组定义
    in: {
      position: 'top',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#fff',
          strokeWidth: 1,
          fill: '#8872FB'
        }
      }
    }
  },
  items: [
    {
      id: 'boot-menu-port1',
      group: 'in'
    }
  ]
};

export const bootMenuItemPorts = {
  groups: {
    out: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#fff',
          strokeWidth: 1,
          fill: '#58C2E2',
          connectionCount: 1
        }
      }
    }
  }
};

// 开始节点链接桩
export const startNodePorts = {
  groups: {
    // 输出链接桩群组定义
    out: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#fff',
          strokeWidth: 1,
          fill: '#58C2E2',
          connectionCount: 1
        }
      }
    }
  },
  items: [
    {
      id: 'start-node-port1',
      group: 'out'
    }
  ]
};

// 转人工链接桩
export const transferToLaborPorts = {
  groups: {
    in: {
      position: 'top',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#fff',
          strokeWidth: 1,
          fill: '#8872FB'
        }
      }
    }
  },
  items: [
    {
      id: 'transfer-to-labor-port1',
      group: 'in'
    }
  ]
};

// 回复消息链接桩
export const dialogueReplyPorts = {
  groups: {
    in: {
      position: 'top',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#fff',
          strokeWidth: 1,
          fill: '#8872FB'
        }
      }
    }
  },
  items: [
    {
      id: 'dialogue-reply-port1',
      group: 'in'
    }
  ]
};

/**
 * 节点工具配置
 * @params {String} fill buttonRemove按钮填充颜色
 * @returns {Object}
 */
export const nodeToolsConfig = (fill = '#FFB10B') => {
  return {
    name: 'button-remove',
    args: {
      x: '100%',
      y: 0,
      offset: { x: -20, y: 20 },
      markup: [
        {
          attrs: {
            fill
          }
        },
        {
          selector: 'path',
          attrs: {
            d: 'M -5 -5 5 5 M -5 5 5 -5'
          }
        }
      ]
    }
  }
}
