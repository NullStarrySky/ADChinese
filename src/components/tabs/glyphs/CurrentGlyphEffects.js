import CurrentGlyphEffect from "./CurrentGlyphEffect.js";
import GlyphSetName from "../../GlyphSetName.js";

const glyphEffectsOrder =
  ["powerpow", "powermult", "powerdimboost", "powerbuy10",
    "infinitypow", "infinityinfmult", "infinityIP", "infinityrate",
    "replicationpow", "replicationdtgain", "replicationspeed", "replicationglyphlevel",
    "timepow", "timeshardpow", "timeEP", "timespeed", "timeetermult",
    "dilationpow", "dilationTTgen", "dilationDT", "dilationgalaxyThreshold",
    "effarigrm", "effarigglyph", "effarigblackhole", "effarigachievement",
    "effarigforgotten", "effarigdimensions", "effarigantimatter",
    "cursedgalaxies", "cursedtickspeed", "curseddimensions", "cursedEP",
    "realityglyphlevel", "realitygalaxies", "realityrow1pow", "realityDTglyph",
    "companiondescription", "companionEP"];

export default {
  name: "CurrentGlyphEffects",
  components: {
    GlyphSetName,
    CurrentGlyphEffect
  },
  data() {
    return {
      effects: [],
      isColored: false,
      hasEffarig: false,
      hasReality: false,
      logTotalSacrifice: 0,
      pelleChaosEffect: {},
    };
  },
  computed: {
    isSoftcapActive() {
      return this.effects.length && !this.effects.every(e => e.value.capped === false);
    },
    uniqueGlyphText() {
      if (!this.hasEffarig && !this.hasReality) return "";
      const uniqueGlyphs = [];
      if (this.hasEffarig) uniqueGlyphs.push(
        `<span style="color: ${GlyphAppearanceHandler.getBorderColor("effarig")};">鹿颈长</span>`);
      if (this.hasReality) uniqueGlyphs.push(
        `<span style="animation: a-reality-glyph-description-cycle 10s infinite;">现实</span>`);
      return `你不能${uniqueGlyphs.length > 1 ? "分别" : ""}装备超过一个 ${uniqueGlyphs.join(" 或 ")}。`;
    },
    noEffects() {
      return !this.effects.length;
    },
    glyphSet() {
      return Glyphs.activeList;
    },
    pelleGlyphText() {
      return Pelle.isDoomed
        ? `符文稀有度固定为 ${formatPercents(strengthToRarity(Pelle.glyphStrength))}, 符文等级的上限为 ${formatInt(Pelle.glyphMaxLevel)}`
        : "";
    },
    showChaosText() {
      return this.pelleChaosEffect.isUnlocked && !this.noEffects;
    },
    chaosEffect() {
      return this.pelleChaosEffect.description;
    },
  },
  watch: {
    logTotalSacrifice() {
      this.glyphsChanged();
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
    update() {
      this.isColored = player.options.glyphTextColors;
      this.hasEffarig = Glyphs.active.some(g => g && g.type === "effarig");
      this.hasReality = Glyphs.active.some(g => g && g.type === "reality");

      this.logTotalSacrifice = GameCache.logTotalGlyphSacrifice.value;

      this.pelleChaosEffect = Pelle.specialGlyphEffect;
    },
    glyphsChanged() {
      this.effects = getActiveGlyphEffects();
      this.effects.sort((a, b) => glyphEffectsOrder.indexOf(a.id) - glyphEffectsOrder.indexOf(b.id));
    },
  },
  template: `
  <div class="c-current-glyph-effects l-current-glyph-effects">
    <div class="pelle-current-glyph-effects">
      {{ pelleGlyphText }}
    </div>
    <div class="c-current-glyph-effects__header">
      已装备符文的加成效果：
    </div>
    <GlyphSetName :glyph-set="glyphSet" />
    <br v-if="isSoftcapActive || hasEffarig || hasReality">
    <span v-html="uniqueGlyphText" />
    <div
      v-if="isSoftcapActive"
      class="l-current-glyph-effects__capped-header"
    >
      <span class="c-current-glyph-effects__effect--capped">斜体</span>
      表示的加成，表示该项加成已达到软上限
    </div>
    <br>
    <div v-if="noEffects">
      无（装备符文才能应用符文的加成效果）
    </div>
    <CurrentGlyphEffect
      v-for="effect in effects"
      :key="effect.id + logTotalSacrifice"
      :effect="effect"
      :is-colored="isColored"
    />
    <div
      v-if="showChaosText"
      class="pelle-current-glyph-effects"
    >
      {{ chaosEffect }}
    </div>
  </div>
  `
};