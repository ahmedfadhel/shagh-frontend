<template>
  <v-item-group active-class="selected-item" mandatory>
    <h3 class="mb-5">
      اللون : <span class="primary--text">{{ name }}</span>
    </h3>
    <v-row desnse>
      <v-col v-for="(option, i) in options" :key="i" cols="2">
        <v-item v-slot="{ active, toggle }">
          <v-card
            class="d-flex align-center"
            @click="toggle"
            v-on:click="selectOption(i)"
            height="64"
          >
            <v-img
              :src="option.thumbnail.path"
              class="align-center"
              height="64"
            >
              <v-scroll-y-transition>
                <div v-if="active" class="text-center">
                  <v-icon color="primary" large>
                    mdi-check-circle-outline</v-icon
                  >
                </div>
              </v-scroll-y-transition>
            </v-img>
          </v-card>
        </v-item>
      </v-col>
    </v-row>
  </v-item-group>
</template>
<script>
export default {
  props: ["options"],
  mounted() {
    let element = this.options.find((ele) => (ele.is_main ? ele.name : ""));
    this.name = element.name;
  },
  data() {
    return {
      name: "",
    };
  },
  computed: {},
  methods: {
    selectOption(index) {
      this.name = this.options[index].name;
      this.$emit("carousel", index);
    },
  },
};
</script>
<style lang="scss" scoped>
// .selected-item {
//   border: 1px solid grey;
// }
</style>