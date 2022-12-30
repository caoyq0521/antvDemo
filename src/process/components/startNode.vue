<template>
  <div class="taskflow-node taskflow-node-start">
    <div class="taskflow-node__title">开始</div>
    <div class="taskflow-node__content">
      当客户进入会话
      <tm-tip
        content="客户进入会话，则触发开始节点；如果会话结束后的48小时内客户再次进入会话咨询，当客户发送第一句消息后，才会触发开始节点；"
        placement="top"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartNode'
}
</script>

<style lang="scss" scoped>
@import '../style/public';
.taskflow-node {
  &-start {
    width: 196px;
  }

  &__content {
    height: 48px;
    line-height: 48px;
  }
}
</style>
