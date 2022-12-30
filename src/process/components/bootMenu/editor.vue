<template>
  <base-drawer
    v-model="showDrawer"
    title="引导菜单"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <div class="form-item">
      <div class="label">
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
      <div class="label">
        <tm-tip content="引导客户点击菜单的文案" placement="top" class="label-tip" />
        引导话术:
      </div>
      <div class="value">
        <el-input
          v-model="nodeInfo.message"
          placeholder="请输入引导话术"
          maxlength="200"
          show-word-limit
          type="textarea"
          resize="none"
        ></el-input>
      </div>
    </div>
    <div class="form-item">
      <div class="label">
        <menu-setting-example class="label-tip" />
        <span class="label-star">*</span>
        菜单设置:
      </div>
      <div class="value">
        <template v-for="(item, index) in nodeInfo.menuList">
          <!-- 回复菜单 -->
          <div v-if="item.type === 1" class="menu-item" :key="index">
            <el-input
              v-model.trim="item.name"
              placeholder="请输入菜单名称"
              maxlength="20"
              show-word-limit
              @change="handleMenuNameChange($event, item)"
            ></el-input>
            <img
              v-if="nodeInfo.menuList.length > 1"
              src="@/assets/reduce.png"
              alt=""
              class="f-csp img-reduce"
              @click="handleMenuDel(index)"
            >
          </div>
          <!-- 跳转菜单 -->
          <div v-if="item.type === 2" class="menu-item menu-item-jump" :key="index">
            <div class="jump-content">
              <el-input
                v-model.trim="item.name"
                placeholder="请输入菜单名称"
                maxlength="20"
                show-word-limit
                @change="handleMenuNameChange($event, item)"
              ></el-input>
              <div class="jump-type">
                <el-select
                  class="jump-type__select"
                  v-model="item.jumpType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <div v-show="item.jumpType === 1" class="jump-type__content">
                  <el-input
                    v-model.trim="item.url"
                    class="jump-type__input"
                    placeholder="请粘贴http://或https://格式的地址"
                  ></el-input>
                </div>
                <div v-show="item.jumpType === 2" class="jump-type__content">
                  <div class="miniprogram-input">
                    <el-input
                      v-model.trim="item.appid"
                      class="jump-type__input"
                      placeholder="请输入小程序APPID"
                    >
                    </el-input>
                  </div>
                  <div class="miniprogram-input">
                    <el-input
                      v-model.trim="item.page"
                      class="jump-type__input"
                      placeholder="请输入小程序路径"
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
            <img
              v-if="nodeInfo.menuList.length > 1"
              src="@/assets/reduce.png"
              alt=""
              class="f-csp img-reduce"
              @click="handleMenuDel(index)"
            >
          </div>
        </template>
        <div
          class="menu-add"
          :disabled="addMenuBtnDisabled"
        >
          <div
            class="f-csp menu-add-item menu-reply"
            @click="handleAddReplyMenu"
          >
            <i class="iconfont iconjiahao"></i>
            <span>回复菜单</span>
          </div>
          <div
            class="f-csp menu-add-item menu-Jump"
            @click="handleAddJumpMenu"
          >
            <i class="iconfont iconjiahao"></i>
            <span>跳转菜单</span>
          </div>
        </div>
      </div>
    </div>
  </base-drawer>
</template>

<script>
import _ from 'lodash';
import BaseDrawer from '../baseDrawer';
import MenuSettingExample from './menuSettingExample';
// 最多添加10个菜单
const MAX_MENU_COUNT = 10;

const reg = new RegExp(/(http|https):\/\/([\w.]+\/?)\S*/)

export default {
  name: 'BootMenuEditor',
  components: {
    BaseDrawer,
    MenuSettingExample
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
      options: [{
        value: 1,
        label: '第三方链接'
      }, {
        value: 2,
        label: '跳转小程序'
      }],
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
    },
    addMenuBtnDisabled () {
      return this.nodeInfo?.menuList?.length >= MAX_MENU_COUNT || false;
    }
  },
  watch: {
    showDrawer () {
      this.nodeInfo = _.cloneDeep(this.nodeData);
      if (!this.nodeInfo.menuList.length) this.handleAddReplyMenu();
    }
  },
  methods: {
    handleMenuNameChange (value, info) {
      // 菜单名称只能输入中文、数字、英文
      info.name = value.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '');
    },
    handleCancel () {
      this.showDrawer = false;
      this.$emit('cancel');
    },
    handleConfirm () {
      const { title, id, menuList, message } = this.nodeInfo;
      if (!title) {
        this.$message('请输入节点名称', 'warning');
        return;
      }
      for (const i of menuList) {
        const { type, name, jumpType, appid, url, page } = i;
        if (!name) {
          this.$message('请输入菜单名称', 'warning');
          return;
        }

        if (type === 2) {
          if (jumpType === 1 && !reg.test(url)) {
            this.$message("跳转链接必须是以http://或https://开头的有效地址", "warning");
            return;
          }
          if (jumpType === 2 && !appid) {
            this.$message("小程序AppId不能为空", "warning");
            return;
          }

          if (jumpType === 2 && !page) {
            this.$message("页面链接不能为空", "warning");
            return;
          }
        }
      }
      if (!this.checkRepeatName(menuList)) {
        this.$message('菜单名称不能重复', 'warning');
        return;
      }
      this.selectCell.data.title = title;
      this.selectCell.data.menuList = menuList;
      this.selectCell.data.message = message;
      this.$emit('confirm', id, { title, message, menuList });
      this.showDrawer = false;
    },
    handleAddReplyMenu () {
      if (this.addMenuBtnDisabled) return;

      this.nodeInfo.menuList.push({
        menuId: this.$uuid(),
        type: 1,
        name: ''
      });
    },
    handleAddJumpMenu () {
      if (this.addMenuBtnDisabled) return;

      this.nodeInfo.menuList.push({
        menuId: this.$uuid(),
        type: 2,
        name: '',
        jumpType: 1, // 跳转类型，1：第三方链接 2：小程序
        url: '',
        appid: '',
        page: ''
      });
    },
    handleMenuDel (index) {
      this.nodeInfo.menuList.splice(index, 1);
    },
    checkRepeatName (list) {
      const map = new Map();
      return list.every(item => {
        return map.has(item.name) ? false : map.set(item.name, true);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/public';

.menu-item {
  display: flex;
  align-items: center;

  & + & {
    margin-top: 14px;
  }

.img-reduce {
  width: 20px;
  margin-left: 12px;
}

  .jump-content {
    width: 480px;

    border: 1px solid #D7D7D7;
    border-radius: 5px;
    overflow: hidden;
    .el-input {
      width: 100%;
    }

    ::v-deep .el-input__inner {
      border-color: transparent;

      &:focus {
        border-color: var(--main-color);
      }
    }
  }

  .jump-type {
    display: flex;
    border-top: 1px solid #D7D7D7;
    background-color: #F9F9F9;

    &__select {
      width: 130px;

      ::v-deep .el-input {
        &, &__inner {
          height: 100%;
          background-color: transparent;
        }
      }
    }

    &__content {
      flex: 1;
      border-left: 1px solid #D7D7D7;

      ::v-deep .el-input {
        &__inner, &-group__append {
          background-color: transparent;
          border-color: transparent;
        }
      }

      .miniprogram-input + .miniprogram-input {
        border-top: 1px solid #D7D7D7;
      }
    }

    &__input {
      width: 100%!important;
    }
  }
}

.menu-add {
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: var(--main-color);

  .menu-add-item + .menu-add-item {
    margin-left: 40px;
  }

  .menu-add-item {
    display: flex;
    align-items: center;

    .iconjiahao {
      margin-right: 10px;
    }
  }

  &[disabled] {
    color: #D7D7D7;

    .menu-add-item {
      cursor: not-allowed;
    }
  }
}

.menu-example {
  @include menuExample(904px);
}

</style>
