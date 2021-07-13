<template>
  <div :class="{'basic-container--block':block}" class="basic-container">
    <slot />
  </div>
</template>

<script>
import { debounce } from '@/util/util'

export default {
  name: 'BasicContainer',
  props: {
    radius: {
      type: [String, Number],
      default: 10
    },
    background: {
      type: String
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      savedPosition: [0, 0]
    }
  },
  computed: {
    styleName() {
      return {
        borderRadius: this.setPx(this.radius),
        background: this.background
      }
    }
  },
  mounted() {
    this.restoreScrollPosition('beforeDestroy')
  },
  activated() {
    this.restoreScrollPosition('deactivated')
  },
  methods: {
    restoreScrollPosition: debounce(function(hookName) {
      this.$el.scrollTop = this.savedPosition[0]
      this.$el.scrollLeft = this.savedPosition[1]

      const handler = e => {
        this.savedPosition = [e.target.scrollTop, e.target.scrollLeft]
      }

      this.$el.addEventListener('scroll', handler)
      this.$once('hook:' + hookName, () => this.$el.removeEventListener('scroll', handler))
    }, 100)
  }
}
</script>
