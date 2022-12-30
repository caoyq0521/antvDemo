<template>
  <div class="taskflow-node transfer-to-labor">
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
    <div class="taskflow-node__content">自动接入人工客服</div>
  </div>
</template>

<script>
export default {
  name: 'TransferToLabor',
  inject: ['getGraph', 'getNode'],
  props: {
    nodeData: Array
  },
  data () {
    return {
      nodeInfo: {
        title: '转人工'
      },
      node: {}
    }
  },
  computed: {
    tipContent () {
      const { hasIncoming = false } = this.nodeInfo;
      if (!hasIncoming) return '节点无连入';
      return '';
    }
  },
  created () {
    this.node = this.getNode()
    const data = this.node.store.data.data

    if (data) {
      this.nodeInfo = data
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/public';

.transfer-to-labor {
  min-width: 200px;

  .taskflow-node {
    &__title {
      background-color: #53C086;
    }

    &__content {
      height: 48px;
      line-height: 48px;
    }
  }
}
</style>
