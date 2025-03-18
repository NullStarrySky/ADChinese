import GlyphComponent from '../../GlyphComponent.js'
import PrimaryButton from '../../PrimaryButton.js'

export default {
  name: 'SingleGlyphCustomzationPanel',
  components: {
    GlyphComponent,
    PrimaryButton,
  },
  data() {
    return {
      glyphID: -1,
      isVisible: true,
    }
  },
  computed: {
    glyph() {
      if (this.glyphID === -1) return null
      const g = Glyphs.findById(this.glyphID)
      return {
        type: g.type,
        level: g.level,
        strength: g.strength,
        effects: g.effects,
        color: g.color,
        symbol: g.symbol,
        cosmetic: g.cosmetic,
      }
    },
    typeCosmetic() {
      const changes = []
      if (GlyphAppearanceHandler.symbolMap[this.glyph.type]) changes.push('Symbol')
      if (GlyphAppearanceHandler.colorMap[this.glyph.type]) changes.push('Color')
      if (changes.length === 0) return 'None'
      return changes.join('/')
    },
    specialCosmetic() {
      if (this.glyph.cosmetic) return this.glyph.cosmetic.capitalize()
      const changes = []
      if (this.glyph.symbol) changes.push('Symbol')
      if (this.glyph.color) changes.push('Color')
      if (changes.length === 0) return 'None'
      return changes.join('/')
    },
  },
  created() {
    // Whenever the inventory changes, this glyph might not exist afterwards
    EventHub.logic.on(GAME_EVENT.GLYPHS_CHANGED, () => {
      this.glyphID = -1
      this.$recompute('glyph')
    })
    EventHub.logic.on(GAME_EVENT.GLYPH_VISUAL_CHANGE, () => {
      this.$recompute('glyph')
    })
  },
  methods: {
    update() {
      this.isVisible = player.reality.glyphs.cosmetics.active && (GlyphAppearanceHandler.availableTypes.length > 0 || CosmeticGlyphTypes.list.some((t) => t.isCosmetic && t.isUnlocked()))
    },
    dragover(event) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return
      event.preventDefault()
    },
    drop(event) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10)
      if (isNaN(id)) return
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE)
      this.glyphID = id
      this.$recompute('glyph')
    },
    openModal() {
      Modal.singleGlyphAppearance.show({ glyphId: this.glyphID })
    },
  },
  template: `
  <div
    v-if="isVisible"
    class="c-single-glyph-cosmetic"
    @dragover="dragover"
    @drop="drop"
    data-v-single-glyph-customzation-panel
  >
    <div
      v-if="glyph"
      class="c-glyph-info"
      data-v-single-glyph-customzation-panel
    >
      <div
        class="c-glyph-info-section"
        data-v-single-glyph-customzation-panel
      >
        <GlyphComponent
          :glyph="glyph"
          :flip-tooltip="true"
          data-v-single-glyph-customzation-panel
        />
      </div>
      <div
        class="c-glyph-info-section c-cosmetic-text"
        data-v-single-glyph-customzation-panel
      >
        <u>外观属性</u>
        类型: {{ glyph.type.capitalize() }}
        <br>
        全部: {{ typeCosmetic }}
        <br>
        单独: {{ specialCosmetic }}
      </div>
      <div
        class="c-glyph-info-section"
        data-v-single-glyph-customzation-panel
      >
        <PrimaryButton
          class="o-primary-btn--subtab-option"
          @click="openModal"
          data-v-single-glyph-customzation-panel
        >
          自定义！
        </PrimaryButton>
        <PrimaryButton
          class="o-primary-btn--subtab-option"
          @click="glyphID = -1"
          data-v-single-glyph-customzation-panel
        >
          清除
        </PrimaryButton>
      </div>
    </div>
    <div v-else>
      在该方框上拖动一个符文来改变其外观！这将在这里复制一个视觉效果，
      但实际的符文本体会留在你的库存中。移除、获得或移动任何符文都会清除这个框。
    </div>
  </div>
  `,
}
