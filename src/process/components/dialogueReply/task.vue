<template>
  <div class="taskflow-node dialogue-reply">
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
      <div v-if="!nodeInfo.message" class="v-flex-center empty">编辑节点</div>
      <div class="text-clamp-2" v-else>{{ nodeInfo.message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogueReply',
  inject: ['getGraph', 'getNode'],
  props: {
    nodeData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      nodeInfo: {
        title: '回复消息',
        message: ''
      },
      node: {}
    }
  },
  computed: {
    tipContent () {
      const { nodeInfo: { message = '', hasIncoming = false } } = this;
      if (!message) return '节点信息不完整';
      if (!hasIncoming) return '节点无连入';
      return ''
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

.dialogue-reply {
  width: 220px;

  .taskflow-node__title {
    background-color: #FFB10B;
  }

  .empty {
    width: 115px;
    height: 36px;
    border: 1px dashed #858598;
    border-radius: 5px;
  }
}

</style>
