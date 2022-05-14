<template>
  <v-container>
    <v-card class="mb-0">
      <v-card-title class="font-weight-bold text-h5 teal white--text pa-5">
        <h1>المنتجات</h1>
      </v-card-title>
    </v-card>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <h3
                  class="text-h5 font-weight-bold primary--text text--darken-1"
                >
                  أضافة منتج جديد
                </h3>
              </v-col>
              <v-col cols="12" md="4">
                <v-divider class="mb-8"></v-divider>
                <v-form ref="createForm" v-model="createValid">
                  <v-text-field
                    outlined
                    label="اسم المنتج"
                    v-model="product.name"
                    :rules="[rules.required, rules.maxName]"
                    max-length="75"
                  >
                  </v-text-field>
                  <v-textarea
                    outlined
                    label="وصف المنتج"
                    v-model="product.description"
                    :rules="[rules.required]"
                  >
                  </v-textarea>
                  <v-autocomplete
                    label="الاقسام"
                    outlined
                    :items="categories"
                    item-text="name"
                    item-value="id"
                    v-model="product.category_id"
                    :rules="[rules.required]"
                  >
                  </v-autocomplete>
                  <v-autocomplete
                    :items="tags"
                    item-text="name"
                    item-value="id"
                    outlined
                    multiple
                    label="العلامات الموسومة"
                    v-model="product.tags_id"
                    :rules="[rules.tagRequired]"
                  >
                  </v-autocomplete>

                  <v-checkbox
                    label="هل المنتج مميز؟"
                    v-model="product.is_featured"
                    class="mr-2"
                  ></v-checkbox>
                  <v-btn
                    block
                    color="primary"
                    x-large
                    class="font-wieght-bold text-h6"
                    @click="saveProduct()"
                  >
                    حفظ المنتج
                  </v-btn>
                </v-form>
              </v-col>
              <v-col cols="12" md="8">
                <v-data-table
                  :headers="headers"
                  :items="products"
                  items-per-page="20"
                >
                  <template v-slot:item.name="{ item }">
                    <td class="font-weight-bold text-center text-body-1">
                      {{ item.name }}
                    </td>
                  </template>
                  <template v-slot:item.category="{ item }">
                    <td class="font-weight-bold text-center text-body-1">
                      {{ item.category.name }}
                    </td>
                  </template>
                  <template v-slot:item.updated_at="{ item }">
                    <td class="font-weight-bold text-center text-body-1">
                      {{ item.updated_at }}
                    </td>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      color="primary"
                      outlined
                      small
                      class="text-body-1"
                      @click="editProduct(item)"
                    >
                      <v-icon small> mdi-pencil </v-icon>
                      تعديل
                    </v-btn>
                    <v-btn
                      color="primary"
                      outlined
                      small
                      class="text-body-1"
                      nuxt
                      exact
                      :to="`products/${item.id}/create-option`"
                    >
                      <v-icon small> mdi-pencil </v-icon>
                      اضافة خيارات
                    </v-btn>
                    <v-btn
                      color="error"
                      outlined
                      small
                      class="text-body-1"
                      @click="deleteProduct(item)"
                    >
                      <v-icon small> mdi-delete </v-icon>
                      حذف
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="800">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          تعديل المنتج
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-form class="mt-6">
                <v-text-field
                  label="الاسم"
                  outlined
                  name="name"
                  ref="proName"
                  :value="copyProduct.name"
                  @change="onChangeName"
                ></v-text-field>
                <v-textarea
                  label="الوصف"
                  outlined
                  name="description"
                  ref="proDescription"
                  :value="copyProduct.description"
                  @change="onChangeDescription"
                >
                </v-textarea>
                <v-select
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  label="الاقسام"
                  ref="proCategory"
                  :value="copyProduct.category.id"
                  outlined
                  @change="onChangeCategory"
                ></v-select>
                <v-select
                  :items="tags"
                  item-text="name"
                  item-value="id"
                  label="العلامات الموسومة"
                  :value="copyProduct.tags"
                  @change="onChangeTags"
                  ref="proTags"
                  multiple
                  outlined
                ></v-select>
                <v-checkbox
                  label="هل المنتج مميز؟"
                  :input-value="copyProduct.is_featured"
                  ref="proIsFeatured"
                  @change="onChangeIsFeatured"
                ></v-checkbox>
              </v-form>
            </v-col>
            <v-col cols="12" md="6">
              <v-list>
                <v-list-item>
                  <span
                    class="d-inline-block font-weight-bold text-body-1 ml-2"
                  >
                    اسم المنتج :
                  </span>
                  <span class="d-inline-block text-body-1">
                    {{ copyProduct.name }}
                  </span>
                  <span class="d-inline-block text-body-1"> </span>
                </v-list-item>
                <v-list-item>
                  <span
                    class="d-inline-block font-weight-bold text-body-1 ml-2"
                  >
                    وصف المنتج :
                  </span>
                  <span class="d-inline-block text-body-1 ml-2">
                    {{ copyProduct.description }}
                  </span>
                </v-list-item>
                <v-list-item>
                  <span
                    class="d-inline-block font-weight-bold text-body-1 ml-2"
                  >
                    قسم المنتج:
                  </span>
                  <span class="d-inline-block text-body-1">
                    {{ copyProduct.category.name }}
                  </span>
                </v-list-item>
                <v-list-item>
                  <v-row>
                    <v-col cols="5" class="py-2 pl-0"
                      ><span
                        class="d-inline-block font-weight-bold text-body-1"
                      >
                        العلامات الموسومة:
                      </span></v-col
                    >
                    <v-col
                      cols="2"
                      v-for="(tag, i) in copyProduct.tags"
                      class="pa-0"
                      :key="i"
                    >
                      <span class="d-inline-block text-body-1 tag-border pa-1">
                        {{ tag.name }}
                      </span>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-list-item class="mt-5">
                  <span
                    class="d-inline-block font-weight-bold text-body-1 ml-2"
                  >
                    هل المنتج مميز؟:
                  </span>
                  <span
                    class="d-inline-block text-body-1"
                    v-if="copyProduct.is_featured"
                  >
                    نعم
                  </span>
                  <span class="d-inline-block text-body-1" v-else> كلا </span>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn class="text-body-1" color="primary" @click="updateProduct()">
            حفظ التعديل</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false"> غلق </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  layout: "dashboard",
  async asyncData({ $axios }) {
    let tagResult = await $axios.get("api/dashboard/tags");
    let catResult = await $axios.get("api/dashboard/category");
    let prodcutsResult = await $axios.get("api/dashboard/products");

    return {
      tags: tagResult.data,
      categories: catResult.data,
      products: prodcutsResult.data,
    };
  },
  data() {
    return {
      createValid: true,
      dialog: false,
      productInex: -1,

      headers: [
        {
          value: "id",
          text: "#",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
        {
          value: "name",
          text: "أسم المنتج",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
        {
          value: "category",
          text: "القسم",
          class: "text-h6 font-weight-bold",
          align: "center",
        },

        {
          value: "updated_at",
          text: "التاريخ",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
        {
          value: "actions",
          text: "التحكم",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
      ],
      rules: {
        required: (value) => !!value || "* الحقل مطلوب",
        maxName: (value) => value.length <= 75 || "75 أحرف كحد أقصى",
        tagRequired: (value) =>
          (value.length && Array.isArray(value)) || "* الحقل مطلوب",
      },

      product: {
        name: "",
        description: "",
        tags_id: [],
        category_id: -1,
        is_featured: false,
      },
      copyProduct: {
        id: -1,
        name: "",
        description: "",
        tags: [],
        category: {
          name: "",
          id: -1,
        },
        is_featured: false,
      },
      editProductValue: {
        // name: "",
        // description: "",
        // tags_id: [],
        // category_id: -1,
        // is_featured: false,
      },
    };
  },
  methods: {
    ...mapActions(["snackbar"]),
    async saveProduct() {
      if (this.$refs.createForm.validate()) {
        let result = await this.$axios({
          method: "POST",
          url: "api/dashboard/product/create",
          data: this.product,
          headers: {
            "Content-Type": "Application/json",
          },
        });
        if (result.status === 200) {
          this.snackbar({
            status: true,
            color: "success",
            message: "تمت الاضافة بنجاح",
          });
          this.products.unshift(result.data);
        } else {
          this.snackbar({
            status: true,
            color: "error",
            message: "لم تتم الاضافة بنجاح",
          });
        }
        this.product.name = "";
        this.product.description = "";
        this.product.category = -1;
        this.product.tags = [];
        this.product.is_featured = false;
        this.$refs.createForm.resetValidation();
      }
    },
    async deleteProduct(item) {
      let result = await this.$axios.delete(
        `api/dashboard/products/delete/${item.id}`
      );
      if (result.status === 204) {
        this.products = this.products.filter((ele) => ele.id !== item.id);
        this.snackbar({
          status: true,
          message: "تمت الازالة بنجاح",
          color: "success",
        });
      } else {
        this.snackbar({
          status: true,
          message: "لم تتم الازالة بنجاح",
          color: "error",
        });
      }
    },
    editProduct(item) {
      this.productInex = this.products.indexOf(item);
      this.copyProduct.id = item.id;
      this.copyProduct.name = item.name;
      this.copyProduct.description = item.description;
      this.copyProduct.tags = item.tags;
      this.copyProduct.category.name = item.category.name;
      this.copyProduct.category.id = item.category.id;
      this.copyProduct.is_featured = item.is_featured;
      this.dialog = true;
    },
    onChangeName(val) {
      this.editProductValue.name = val;
    },
    onChangeDescription(val) {
      this.editProductValue.description = val;
    },
    onChangeCategory(val) {
      this.editProductValue.category_id = val;
    },
    onChangeTags(val) {
      this.editProductValue.tags_id = val.slice();
    },
    onChangeIsFeatured(val) {
      this.editProductValue.is_featured = val;
    },
    async updateProduct() {
      let data = {};

      let result = await this.$axios({
        method: "PATCH",
        url: `api/dashboard/product/${this.copyProduct.id}/edit`,
        data: this.editProductValue,
        headers: {
          "Content-Type": "Application/json",
        },
      });
      if (result.status === 200) {
        Object.assign(this.products[this.productInex], result.data);
        this.snackbar({
          message: "تم التعديل بنجاح",
          status: true,
          color: "success",
        });
        this.dialog = false;
      } else {
        this.snackbar({
          message: "لم يتم التعديل بنجاح",
          status: true,
          color: "error",
        });
        this.dialog = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-border {
  border: 1px solid gray;
  border-radius: 5px;
}
</style>