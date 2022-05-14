<template>
  <v-app>
    <TopHeader />
    <v-divider></v-divider>
    <NavBar class="mb-2" />
    <v-main>
      <nuxt />
    </v-main>

    <v-footer :fixed="fixed" app class="white mt-5">
      <v-layout grow justify-center>
        <span class="text-h6">
          <span class="primary--text">شغف ايبوكسي</span> جميع الحقوق محفوظة
          لصفحة &copy; {{ new Date().getFullYear() }}
        </span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import TopHeader from "~/components/main/TopHeader";
import NavBar from "~/components/main/NavBar";
export default {
  components: {
    NavBar,
    TopHeader,
  },
  data() {
    return {
      fixed: false,
    };
  },
};
</script>
