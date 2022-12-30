<template>
  <div class="text-clamp-1 menu-item">
    {{ nodeInfo.name }}
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  inject: ['getGraph', 'getNode'],
  props: {
    nodeData: Array
  },
  data () {
    return {
      nodeInfo: {
        name: ''
      },
      node: {}
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
.menu-item + .menu-item {
  margin-left: 6px;
}

.menu-item {
  width: 114px;
  padding: 8px 20px;
  text-align: center;
  cursor: move;
  border-radius: 5px;
  border: 1px solid #D7D7D7;
}
</style>
