export default {
  name: "SpeedrunMilestoneSingle",
  props: {
    milestone: {
      type: Object,
      required: true
    },
    display: {
      type: Boolean,
      required: false,
      default: false,
    },
    time: {
      type: Number,
      required: false,
      default: 0,
    }
  },
  computed: {
    displayName() {
      return this.display ? this.milestone.name : "???";
    },
    description() {
      if (!this.display) return "";
      return typeof this.milestone.description === "function"
        ? this.milestone.description()
        : this.milestone.description;
    },
    timeDisplay() {
      return this.time
        ? `完成于 ${TimeSpan.fromMilliseconds(this.time).toStringShort(true, true)}`
        : "未完成";
    },
    classObject() {
      return {
        "l-speedrun-milestone-entry": true,
        "l-speedrun-milestone-entry--completed": this.time
      };
    }
  },
  template: `
  <div :class="classObject">
    <b>{{ displayName }}</b>
    <i>{{ description }}</i>
    {{ timeDisplay }}
  </div>
  `
};