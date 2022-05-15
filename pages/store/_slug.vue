<template>
  <div id="product">
    <div class="breadcrumbs grey lighten-4">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-breadcrumbs
              :items="breadcrubsItems"
              large
              class="pt-2 pb-2"
            ></v-breadcrumbs>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="product">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-carousel hide-delimiters height="auto" v-model="carouselModel">
              <v-carousel-item
                v-for="(image, i) in getAllImages"
                :key="i"
                eager
              >
                <v-img
                  :src="image.path"
                  :alt="image.alt_text"
                  contain
                  eager
                  height="100%"
                >
                </v-img>
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col cols="12" md="6">
            <div class="product-info">
              <h1 class="text-h3">{{ product.name }}</h1>
              <p class="text-h4 primary--text mt-5">
                {{ getCurrentPice }} <sup>د.ع</sup>
              </p>
              <p class="product-info_description">
                {{ product.description }}
              </p>
              <ColorOptions
                :options="product.product_options"
                v-if="getType === 'ge'"
                @carousel="emitCarousel"
              />
            </div>
            <v-divider class="my-5"></v-divider>
            <div class="product-selection">
              <v-container fluid class="px-0 py-0">
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      type="number"
                      v-model="selectedOption.qty"
                      outlined
                      class="primary--text"
                      lable="الكمية"
                      @change="updateQty"
                    >
                      <v-icon slot="prepend" color="primary" @click="incQty()">
                        mdi-plus
                      </v-icon>
                      <v-icon
                        slot="append-outer"
                        color="primary"
                        @click="decQty()"
                      >
                        mdi-minus
                      </v-icon>
                    </v-text-field>
                  </v-col>
                  <v-col cols="8">
                    <v-btn
                      color="primary"
                      x-large
                      class="text-body-1 font-weight-bold"
                      block
                      >أضافة الى السلة</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="test mt-5">
      <div>test div</div>
    </div>
  </div>
</template>
<script>
import ColorOptions from "~/components/main/options/ColorOptions.vue";
export default {
  async asyncData({ params, $axios }) {
    let proResult = await $axios.get(
      encodeURI(`api/store/products/${params.slug}`)
    );
    return {
      product: proResult.data,
    };
  },
  mounted() {
    this.selectedOption.name = this.product.name;

    this.product.product_options.forEach((el) => {
      if (el.is_main) {
        this.type = el.option.name;
        if (el.is_discount) {
          this.currentPrice = el.discount_price;
        } else {
          this.currentPrice = el.price;
        }

        this.optionStock = el.in_stock;
        if (el.is_discount) {
          this.selectedOption.price = el.discount_price;
        } else {
          this.selectedOption.price = el.price;
        }
        this.selectedOption.id = el.id;
        this.selectedOption.optionName = el.name;
        this.selectedOption.thumbnail = el.thumbnail.path;
      }
    });
  },

  data() {
    return {
      items: [
        {
          text: "المتجر",
          disabled: false,
          href: "/store",
        },
      ],
      currentPrice: 0,
      type: "ge",
      carouselModel: 0,

      optionStock: 0,
      selectedQty: 1,
      // selected option required parameter
      selectedOption: {
        id: -1,
        name: "",
        qty: 1,
        optionName: "",
        thumbnail: "",
        price: -1,
      },
    };
  },
  components: {
    ColorOptions,
  },
  methods: {
    emitCarousel(index) {
      this.carouselModel = index;
      this.currentPrice = this.product.product_options[index].is_discount
        ? this.product.product_options[index].discount_price
        : this.product.product_options[index].price;

      this.optionStock = this.product.product_options[index].in_stock;
      // selected option values
      this.selectedOption.id = index;
      this.selectedOption.name = this.product.name;
      if (this.product.product_options[index].is_discount) {
        this.selectedOption.price =
          this.product.product_options[index].discount_price;
      } else {
        this.selectedOption.price = this.product.product_options[index].price;
      }

      this.selectedOption.optionName = this.product.product_options[index].name;
      this.selectedOption.thumbnail =
        this.product.product_options[index].thumbnail.path;
      this.selectedOption.qty = 1;
    },
    incQty() {
      if (this.selectedOption.qty < this.optionStock) {
        this.selectedOption.qty += 1;
      }
    },
    decQty() {
      if (this.selectedOption.qty > 1) {
        this.selectedOption.qty -= 1;
      }
    },
    updateQty(val) {
      val <= this.optionStock && val > 0
        ? (this.selectedOption.qty = val)
        : (this.selectedOption.qty = 1);
    },
  },
  computed: {
    breadcrubsItems() {
      let currentPage = {
        text: this.product.name,
        disabled: true,
        href: `/store/${this.product.slug}`,
      };
      return [...this.items, currentPage];
    },
    getAllImages() {
      let images = this.product.product_options.map((ele) => ele.thumbnail);
      return images;
    },
    getCurrentPice() {
      return this.currentPrice;
    },
    getType() {
      return this.type;
    },
    getStockValues() {
      // using spread operator to create array using the keys of the array
      // then slice the first element to get ride from the 0
      return [...Array(this.optionStock + 1).keys()].slice(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.product-info {
  .product-info_description {
    font-size: 1.2rem;
    margin-top: 1rem;
  }
}
.v-carousel {
  border-radius: 5px;
}
</style>