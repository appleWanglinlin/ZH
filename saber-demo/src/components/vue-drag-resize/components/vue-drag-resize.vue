<template>
  <div>
    <div v-if="visible"
         class="vdr"
         :style="style"
         :class="`${(active || isActive) ? 'active' : 'inactive'} ${contentClass ? contentClass: ''}`"
         @mousedown="bodyDown($event)"
         @touchstart="bodyDown($event)"
         @touchend="up($event)"
    >
      <div class="el-dialog__header">
        <span class="el-dialog__title">{{ title }}</span>
        <button
          type="button"
          aria-label="Close"
          class="el-dialog__headerbtn"
          @click="closed"
        >
          <i class="el-dialog__close el-icon el-icon-close" />
        </button>
      </div>
      <div class="el-dialog__body">
        <slot />
      </div>
      <div
        v-for="(stick, i) in sticks"
        :key="i"
        class="vdr-stick"
        :class="['vdr-stick-' + stick, isResizable ? '' : 'not-resizable']"
        :style="vdrStick(stick)"
        @mousedown.stop.prevent="stickDown(stick, $event)"
        @touchstart.stop.prevent="stickDown(stick, $event)"
      />

    </div>
  </div>
</template>
<script src="./vue-drag-resize.js"></script>
<style lang="css" scoped>
.vdr {
    position: absolute;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
    border-radius: 4px;
}
.vdr .el-dialog__body{
  height: calc(100% - 100px);
  overflow: auto;
}
/* .vdr.active:before{
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    outline: 1px dashed #d6d6d6;
} */
.vdr-stick {
    box-sizing: border-box;
    position: absolute;
    font-size: 1px;
    /* background: #ffffff;
    border: 1px solid #6c6c6c;
    box-shadow: 0 0 2px #bbb; */
}
.inactive .vdr-stick {
    display: none;
}
.vdr-stick-tl, .vdr-stick-br {
    cursor: nwse-resize;
}
.vdr-stick-tm, .vdr-stick-bm {
    /* left: 50%; */
    left: 8px;
    width: calc(100% - 8px) !important;
    cursor: ns-resize;
}
.vdr-stick-tr, .vdr-stick-bl {
    cursor: nesw-resize;
}
.vdr-stick-ml, .vdr-stick-mr {
    /* top: 50%; */
    top: 8px;
    height: calc(100% - 8px) !important;
    cursor: ew-resize;
}
.vdr-stick.not-resizable{
    display: none;
}
</style>
