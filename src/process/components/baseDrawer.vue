<template>
  <el-drawer
    title="我是标题"
    :visible.sync="drawer"
    :show-close="false"
    :with-header="false"
    :size="716"
    :before-close="handleClose"
  >
    <div class="container">
      <div class="header">
        <div class="title">
          {{ title }}
          <slot name="title"></slot>
        </div>
        <div class="operation">
          <tm-button @click="handleCancel">取消</tm-button>
          <tm-button @click="handleConfirm" type="primary">确定</tm-button>
        </div>
      </div>
      <div class="mainbody">
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>

export default {
  name: 'BaseDrawer',
  components: {

  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  computed: {
    drawer: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    handleClose () {

    },
    handleCancel () {
      this.$emit('cancel');
    },
    handleConfirm () {
      this.$emit('confirm');
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding-left: 24px;
  border-bottom: 1px solid #D7D7D7;

  .title {
    font-size: 14px;
    font-weight: 550;
  }

  .operation {
    height: 100%;

    .tm-button {
      width: 100px;
      min-width: 100px;
      height: 100%;
      font-size: 14px;
      border: none;
      border-radius: 0;
      margin: 0;
    }
  }
}

.mainbody {
  flex: 1;
  padding: 8px;
  overflow: hidden;
  background-color: #F4F4F6;
}

.content {
  height: 100%;
  padding: 15px;
  overflow-x: hidden;
  background-color: #fff;
  border-radius: 5px;
}
</style>
