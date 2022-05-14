<template>
  <v-card class="single-product" nuxt :to="`/store/${product.product.slug}`">
    <v-img
      :height="height"
      :src="product.thumbnail.path"
      :alt="product.thumbnail.alt_text"
    ></v-img>
    <v-card-title class="justify-center pb-2 text-h5">{{
      product.product.name
    }}</v-card-title>
    <v-card-text class="text-center text-h6 primary--text">
      {{ product.price }}
      <sup>د.ع</sup>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["product", "height"],
};
</script>
