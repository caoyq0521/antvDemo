<template>
  <base-drawer
    v-model="showDrawer"
    title="回复消息"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #title>
      <el-popover
        placement="top"
        trigger="hover"
      >
      </el-popover>
    </template>
    <div class="form-item">
      <div class="label" required>
        <tm-tip content="不会展示给客户，用作节点记录" placement="top" class="label-tip" />
        <span class="label-star">*</span>
        节点名称:
      </div>
      <div class="value">
        <el-input
          v-model.trim="nodeInfo.title"
          placeholder="请输入节点名称"
          maxlength="20"
          show-word-limit
        ></el-input>
      </div>
    </div>
    <div class="form-item">
      <div class="label" required>
        <tm-tip content="菜单点击后，系统自动回复的消息内容，附件最多可添加4个" placement="top" class="label-tip" />
        <span class="label-star">*</span>
        回复内容:
      </div>
      <div class="value">
        <el-input
          v-model="nodeInfo.message"
          placeholder="请输入消息内容"
          maxlength="200"
          show-word-limit
          type="textarea"
          resize="none"
        ></el-input>
        <div
          v-if="isFromStartNode"
          class="warn-tip"
        >
          <i class="iconfont iconjingshi"></i>
          <span>直连开始节点</span>
        </div>
      </div>
    </div>
  </base-drawer>
</template>

<script>
import _ from 'lodash';
import BaseDrawer from '../baseDrawer';

export default {
  name: 'DialogueReplyEditor',
  components: {
    BaseDrawer
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selectCell: {
      default: ''
    },
    nodeData: {
      type: Object,
      default: () => ({})
    },
    graph: {
      default: ''
    }
  },
  data () {
    return {
      addLinkVisible: false,
      addMiniProgramVisible: false,
      nodeInfo: {}
    }
  },
  computed: {
    // 是否直接连接开始节点
    isFromStartNode () {
      return this.nodeInfo?.fromStart || false;
    },
    showDrawer: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  },
  watch: {
    showDrawer (newValue) {
      if (newValue) {
        this.nodeInfo = _.cloneDeep(this.nodeData);
      }
    }
  },
  methods: {
    handleCancel () {
      this.showDrawer = false;
      this.$emit('cancel');
    },
    handleConfirm () {
      const { title, id, content, message } = this.nodeInfo;
      if (!title) {
        this.$message('请输入节点名称', 'warning');
        return;
      }

      if (!message.trim() && !content.length) {
        return this.$message('请输入回复内容', 'warning');
      }

      // 直连开始节点时
      if (this.isFromStartNode) {
        // 消息内容必填
        if (!message.trim()) {
          return this.$message('请输入消息内容', 'warning');
        }
      }
      this.selectCell.data.title = title;
      this.selectCell.data.message = message;
      this.$emit('confirm', id, { title, message, content });
      this.showDrawer = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/public';
.other-news {
  display: flex;
  margin: 14px 0;

  &>div {
    margin-right: 6px;
  }

  ::v-deep .tm-button {
    min-width: 85px;
  }
}

.warn-tip {
  display: flex;
  align-items: center;
  height: 35px;
  padding: 10px;
  margin-bottom: 14px;
  color: #F67172;
  background-color: #FEF1F0;
  border-radius: 5px;

  .iconjingshi {
    margin-right: 12px;
  }
}

.menu-example {
  @include menuExample(546px);
}
</style>
