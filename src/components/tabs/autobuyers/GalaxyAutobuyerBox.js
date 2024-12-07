import AutobuyerBox from "./AutobuyerBox.js";
import AutobuyerInput from "./AutobuyerInput.js";
import AutobuyerIntervalButton from "./AutobuyerIntervalButton.js";

export default {
  name: "GalaxyAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerIntervalButton,
    AutobuyerInput
  },
  props: {
    isModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      hasMaxedInterval: false,
      limitGalaxies: false,
      isBuyMaxUnlocked: false,
      buyMax: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.galaxy,
    limitGalaxiesSlot() {
      return this.hasMaxedInterval && !this.isBuyMaxUnlocked ? "intervalSlot" : "toggleSlot";
    }
  },
  watch: {
    limitGalaxies(newValue) {
      this.autobuyer.limitGalaxies = newValue;
    }
  },
  methods: {
    update() {
      this.hasMaxedInterval = this.autobuyer.hasMaxedInterval;
      this.isBuyMaxUnlocked = this.autobuyer.isBuyMaxUnlocked;
      this.limitGalaxies = this.autobuyer.limitGalaxies;
    }
  },
  template: `
  <AutobuyerBox
    :autobuyer="autobuyer"
    :is-modal="isModal"
    name="自动购买反物质星系"
    :show-interval="!isBuyMaxUnlocked"
  >
    <template
      v-if="!hasMaxedInterval"
      #intervalSlot
    >
      <AutobuyerIntervalButton :autobuyer="autobuyer" />
    </template>
    <template
      v-else-if="isBuyMaxUnlocked"
      #intervalSlot
    >
      <div class="c-autobuyer-box__small-text">
        X 秒后进行：
      </div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="float"
        property="buyMaxInterval"
      />
    </template>
    <template #[limitGalaxiesSlot]>
      <label
        class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text o-clickable"
        data-v-galaxy-autobuyer-box
      >
        <input
          v-model="limitGalaxies"
          type="checkbox"
          class="o-clickable"
          data-v-galaxy-autobuyer-box
        >
        反物质星系限制：
      </label>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="int"
        property="maxGalaxies"
      />
    </template>
  </AutobuyerBox>
  `
};