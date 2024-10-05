import ModalWrapperChoice from "../ModalWrapperChoice.js";

export default {
  name: "AntimatterGalaxyModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    bulk: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      newGalaxies: 0,
      keepAntimatter: false,
      perkANRBought: false,
      keepDimBoost: false
    };
  },
  computed: {
    topLabel() {
      if (this.bulk) return `你将购买 ${formatInt(this.newGalaxies)} 个反物质星系`;
      return `你将购买一个反物质星系`;
    },
    message() {
      const resetResouces = [];
      if (Pelle.isDoomed) resetResouces.push("Antimatter", "Antimatter Dimensions", "Tickspeed");
      if (!this.perkANRBought) resetResouces.push("Antimatter Dimensions", "Tickspeed");
      if (!this.keepDimBoost) resetResouces.push("Dimension Boosts");
      if (!this.keepAntimatter && !this.perkANRBought) resetResouces.push("Antimatter");
      const resetList = makeEnumeration(resetResouces);
      let tickspeedFixed = "";
      if (InfinityChallenge(3).isRunning) {
        tickspeedFixed = `Infinity Challenge ${InfinityChallenge(3).id}`;
      } else if (Ra.isRunning) {
        tickspeedFixed = `${Ra.displayName}'s Reality`;
      }
      const tickspeedInfo = (tickspeedFixed === "")
        ? "you will receive a small boost to Tickspeed Upgrades."
        : `you will not receive a boost to Tickspeed Upgrades, because you are in ${tickspeedFixed}.`;
      const message = (resetList === "")
        ? `This will reset nothing, and ${tickspeedInfo}`
        : `This will reset your ${resetList}. However, ${tickspeedInfo}`;

      if (this.bulk) return `你确定要购买
      ${formatInt(this.newGalaxies)} 个反物质星系？ ${message}`;
      return `你确定要购买一个反物质星系吗？ ${message}`;
    }
  },
  created() {
    this.on$(GAME_EVENT.DIMBOOST_AFTER, () =>
      (BreakInfinityUpgrade.autobuyMaxDimboosts.isBought ? undefined : this.emitClose()));
  },
  methods: {
    update() {
      if (this.bulk) {
        const req = Galaxy.requirement;
        const dim = AntimatterDimension(req.tier);
        const bulk = bulkBuyBinarySearch(dim.totalAmount, {
          costFunction: x => Galaxy.requirementAt(x).amount,
          cumulative: false,
        }, player.galaxies);
        if (bulk) {
          this.newGalaxies = Galaxy.buyableGalaxies(Math.round(dim.totalAmount.toNumber())) - player.galaxies;
        }
      }
      this.keepAntimatter = Achievement(111).isUnlocked;
      this.perkANRBought = Perk.antimatterNoReset.canBeApplied;
      this.keepDimBoost = (Achievement(143).isUnlocked && !Pelle.isDoomed) ||
        PelleUpgrade.galaxyNoResetDimboost.canBeApplied;
    },
    handleYesClick() {
      requestGalaxyReset(this.bulk);
      EventHub.ui.offAll(this);
    }
  },
  template: `
  <ModalWrapperChoice
    option="antimatterGalaxy"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>

    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
  `
}