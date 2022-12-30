<template>
  <base-drawer
    title="转人工"
    v-model="showDrawer"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #title>
      <el-popover
        placement="top"
        trigger="hover"
      >
        <div class="menu-example">
          <img src="../../images/menu-labor.png" alt="">
        </div>
        <span class="f-csp menu-example__tip" slot="reference">示例</span>
      </el-popover>
    </template>
    <div class="form-item">
      <div class="label" required>
        <tm-tip content="不会展示给客户，用作节点记录" placement="top" class="label-tip" />
        <span class="label-star">*</span>
        节点名称:
      </div>
      <div class="value">
        <div class="input-area">
          <el-input
            v-model.trim="nodeInfo.title"
            placeholder="请输入节点名称"
            maxlength="20"
            show-word-limit
          ></el-input>
        </div>
        <div class="tip-area">
          <div>客户触发该节点后将接入人工客服；</div>
          <div>接待人员、上限、分配等规则，将在创建渠道时设置；</div>
        </div>
      </div>
    </div>
  </base-drawer>
</template>

<script>
import _ from 'lodash';
import BaseDrawer from '../baseDrawer';

export default {
  name: 'TransferToLaborEditor',
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
    }
  },
  data () {
    return {
      nodeInfo: {}
    }
  },
  computed: {
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
    showDrawer () {
      this.nodeInfo = _.cloneDeep(this.nodeData);
    }
  },
  methods: {
    handleCancel () {
      this.showDrawer = false;
      this.$emit('cancel');
    },
    handleConfirm () {
      const { title, id } = this.nodeInfo;
      if (!title) {
        this.$message('请输入节点名称', 'warning');
        return;
      }
      this.selectCell.data.title = title;
      this.$emit('confirm', id, { title });
      this.showDrawer = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/public';

.tip-area {
  margin-top: 14px;
  padding: 14px 0 14px 16px;
  line-height: 20px;
  color: #858598;
  background-color: #F4F4F6;
  border-radius: 5px;
}

.menu-example {
  @include menuExample(502px);
}
</style>
