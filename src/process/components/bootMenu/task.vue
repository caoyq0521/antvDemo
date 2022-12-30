<template>
  <div class="taskflow-node boot-menu">
    <div class="taskflow-node__title">
      <div class="left">
        <tm-tip
          icon-name="iconjingshi"
          icon-color="#F67172"
          :content="tipContent"
          placement="top"
          width="auto"
        />
        <span class="text-clamp-1">{{ nodeInfo.title }}</span>
      </div>
    </div>
    <div class="v-flex-center taskflow-node__content">
      <div v-if="!nodeInfo.menuList.length" class="v-flex-center empty">编辑节点</div>
      <template v-else>
        <div
          v-for="(item, index) in nodeInfo.menuList"
          class="text-clamp-1 menu-item"
          :key="index"
        >
          {{ item.name }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BootMenu',
  inject: ['getGraph', 'getNode'],
  props: {
    nodeData: Array
  },
  data () {
    return {
      nodeInfo: {
        title: '引导菜单',
        message: '',
        menuList: []
      },
      node: {}
    }
  },
  computed: {
    tipContent () {
      const { menuList = [], hasIncoming = false, hasEnoughOutgoing } = this.nodeInfo;
      if (!menuList.length) return '节点信息不完整';
      const tips = [];
      if (!hasIncoming) tips.push('连入');
      if (!hasEnoughOutgoing) tips.push('连出');
      if (tips.length) {
        return `节点无${tips.join('、')}`;
      }
      return '';
    }
  },
  created () {
    this.node = this.getNode();
    const data = this.node.store.data.data;

    if (data) {
      this.nodeInfo = data;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/public';

.boot-menu {
  min-width: 220px;

  .taskflow-node {
    &__title {
      background-color: var(--main-color);
    }

    &__content {

      .empty {
        width: 115px;
        height: 36px;
        border: 1px dashed #858598;
        border-radius: 5px;
      }

      .menu-item + .menu-item {
        margin-left: 6px;
      }

      .menu-item {
        width: 114px;
        padding: 8px 20px;
        opacity: 0;
        border-radius: 5px;
        border: 1px solid #D7D7D7;
      }
    }
  }
}
</style>
