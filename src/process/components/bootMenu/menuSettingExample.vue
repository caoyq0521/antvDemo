<template>
  <el-popover placement="top" trigger="hover">
    <div class="menu-setting-tip">
      <div class="item">
        <span class="label">菜单名称：</span>
        展示给客户的菜单名称，菜单名称仅支持文本、数字、字母；
      </div>
      <div class="item">
        <span class="label">回复菜单：</span>
        菜单点击之后可以自动回复；

        <div class="replay-menu-tip">
          <div>① 在画布中将菜单项与「引导菜单」节点连接，菜单点击后将自动回复“引导菜单”；</div>
          <div>② 在画布中将菜单项与「回复消息」节点连接，菜单点击将自动回复“消息内容”；</div>
          <div>③ 在画布中将菜单项与「转人工」节点连接，菜单点击将触发转人工；</div>
        </div>
      </div>
      <div class="item">
        <span class="label">跳转菜单：</span>
        菜单点击后可以直接跳转到链接/小程序，跳转菜单不需要与其他节点连接，只需设置菜单名称和跳转地址即可；
      </div>
    </div>
    <i class="f-csp tm-icon-wenhao11 icon-wenhao" slot="reference"></i>
  </el-popover>
</template>

<script>
export default {
  name: 'MenuSettingExample'
}
</script>

<style lang="scss" scoped>
.menu-setting-tip {
  font-size: 14px;
  color: #858598;

  .item {
    margin-bottom: 6px;
  }

  .label {
    font-weight: 550;
    color: #000;
  }
}

.replay-menu-tip {
  &, div + div {
    margin-top: 6px;
  }
}

.example {
  &, img {
    width: 532px;
  }
}

.example-text {
  color: var(--main-color);

  &:hover {
    text-decoration: underline;
  }
}

.icon-wenhao {
  color: rgba(193, 193, 202, 0.5);
  font-size: 16px;
}
</style>
