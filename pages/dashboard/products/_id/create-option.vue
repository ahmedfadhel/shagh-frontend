<template>
  <v-container>
    <v-row class="px-5">
      <v-col md="6">
        <h1>الخيارات الخاصة بالمنتج - {{ product.name }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <h3
                  class="text-h5 font-weight-bold primary--text text--darken-1"
                >
                  أضافة خيار جديد
                </h3>
              </v-col>
              <v-col cols="12" md="4">
                <v-divider class="mb-8"></v-divider>
                <v-form ref="createForm" v-model="createValid" lazy-validation>
                  <v-text-field
                    outlined
                    label="اسم المنتج"
                    v-model="newOptionValues.name"
                    :rules="[rules.required, rules.maxName]"
                    max-length="75"
                  >
                  </v-text-field>
                  <v-text-field
                    outlined
                    label="الرمز"
                    hint="الرمز الخاص (للالوان فقط)"
                    v-model="newOptionValues.value"
                    max-length="75"
                  >
                  </v-text-field>
                  <v-text-field
                    label="سعر المنتج"
                    outlined
                    number
                    :rules="[rules.required]"
                    v-model="newOptionValues.price"
                  ></v-text-field>
                  <v-text-field
                    label="سعر تكلفة المنتج"
                    outlined
                    number
                    :rules="[rules.required]"
                    v-model="newOptionValues.purchase_price"
                  ></v-text-field>
                  <v-checkbox
                    v-model="newOptionValues.is_discount"
                    label="هل يوجد خصم؟"
                  ></v-checkbox>
                  <v-text-field
                    label="سعر الخصم "
                    outlined
                    number
                    :rules="[rules.required]"
                    v-model="newOptionValues.discount_price"
                  ></v-text-field>
                  <v-text-field
                    label="رمز المنتج"
                    outlined
                    number
                    :rules="[rules.required]"
                    v-model="newOptionValues.sku"
                  ></v-text-field>
                  <v-text-field
                    label="كمية المنتج"
                    outlined
                    number
                    :rules="[rules.required]"
                    v-model="newOptionValues.in_stock"
                  ></v-text-field>
                  <v-checkbox
                    v-model="newOptionValues.is_main"
                    label="هل الاختيار رئيسي؟"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="newOptionValues.is_set"
                    label="هل الاختيار مجموعة؟"
                  ></v-checkbox>
                  <v-select
                    :items="options"
                    item-text="name"
                    item-value="id"
                    label="نوع الاختيار"
                    outlined
                    :rules="[rules.required]"
                    v-model="newOptionValues.option_id"
                  ></v-select>
                  <v-file-input
                    v-model="newOptionValues.thumbnail_path"
                    prepend-icon=""
                    prepend-inner-icon="mdi-camera"
                    class="mt-3"
                    label="صورة الاختيار"
                    :rules="rules.imageRequired"
                    outlined
                  ></v-file-input>
                  <v-text-field
                    label="وصف صورة المنتج"
                    v-model="newOptionValues.thumbnail_alt_text"
                    outlined
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-btn
                    block
                    color="primary"
                    x-large
                    class="font-wieght-bold text-h6"
                    @click="saveOptionValue()"
                  >
                    حفظ الاختيار
                  </v-btn>
                </v-form>
              </v-col>
              <v-col cols="12" md="8">
                <v-data-table
                  :headers="headers"
                  :items="optionValues"
                  :items-per-page="10"
                  :footer-props="{
                    'items-per-page-options': [10, 20, 30, -1],
                  }"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      @click="editOptionValue(item)"
                      color="primary"
                      outlined
                      small
                      class="text-body-1 mt-2"
                    >
                      <v-icon small> mdi-pencil </v-icon>
                      تعديل
                    </v-btn>
                    <v-btn
                      color="error"
                      outlined
                      small
                      class="text-body-1 my-2"
                      @click="deleteOption(item)"
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
    <!-- edit dialog section start -->
    <v-dialog v-model="dialog" width="800">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          تعديل العلامة الموسومة ({{ copyOptionValues.name }})
        </v-card-title>

        <v-card-text>
          <v-row>
            <!-- Edit form section start -->
            <v-col cols="12" md="6">
              <v-form class="mt-6">
                <v-text-field
                  outlined
                  label="اسم المنتج"
                  ref="opName"
                  :rules="[rules.maxName]"
                  max-length="75"
                  @change="onChangeName"
                  :value="copyOptionValues.name"
                >
                </v-text-field>
                <v-text-field
                  outlined
                  label="الرمز"
                  hint="الرمز الخاص (للالوان فقط)"
                  ref="opValue"
                  max-length="75"
                  @change="onChangeValue"
                  :value="copyOptionValues.value"
                >
                </v-text-field>
                <v-text-field
                  label="سعر المنتج"
                  outlined
                  number
                  :value="copyOptionValues.price"
                  ref="opPrice"
                  @change="onChangePrice"
                ></v-text-field>
                <v-text-field
                  label="سعر تكلفة المنتج"
                  outlined
                  number
                  :value="copyOptionValues.purchase_price"
                  ref="opPurchasePrice"
                  @change="onChangePurchasePrice"
                ></v-text-field>
                <v-checkbox
                  label="هل يوجد خصم؟"
                  :input-value="copyOptionValues.is_discount"
                  ref="opIsDiscount"
                  @change="onChangeIsDiscount"
                ></v-checkbox>
                <v-text-field
                  label="سعر الخصم "
                  outlined
                  number
                  :value="copyOptionValues.discount_price"
                  ref="opDiscountPrice"
                  @change="onChangeDiscountPrice"
                ></v-text-field>
                <v-text-field
                  label="رمز المنتج"
                  outlined
                  number
                  :value="copyOptionValues.sku"
                  ref="opSku"
                  @change="onChangeSku"
                ></v-text-field>
                <v-text-field
                  label="كمية المنتج"
                  outlined
                  number
                  :value="copyOptionValues.in_stock"
                  ref="opInStock"
                  @change="onChangeInStock"
                ></v-text-field>
                <v-checkbox
                  label="هل الاختيار رئيسي؟"
                  :input-value="copyOptionValues.is_main"
                  ref="opIsMain"
                  @change="onChangeIsMain"
                ></v-checkbox>
                <v-select
                  :items="options"
                  item-text="name"
                  item-value="id"
                  label="نوع الاختيار"
                  outlined
                  :value="copyOptionValues.option.id"
                  ref="opOptionValue"
                  @change="onChangeOption"
                ></v-select>
                <v-file-input
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  class="mt-3"
                  label="صورة الاختيار"
                  v-model="editOptionValues.thumbnail_path"
                  outlined
                ></v-file-input>
                <v-text-field
                  label="وصف صورة المنتج"
                  outlined
                  :value="copyOptionValues.thumbnail.alt_text"
                  ref="opThumbnailAltText"
                  @change="onChangeThumbnailAltText"
                ></v-text-field>
              </v-form>
            </v-col>
            <!-- Edit form section end -->

            <!-- old information display section start -->
            <v-col cols="12" md="6">
              <v-list>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    اسم الاختيار :
                  </span>
                  <span class="d-inline-block mr-2 text-body-1">{{
                    copyOptionValues.name
                  }}</span>
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    الرمز :
                  </span>
                  <span class="d-inline-block mr-2 text-body-1">{{
                    copyOptionValues.value
                  }}</span>
                </v-list-item>

                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    السعر :
                  </span>
                  <span class="d-inline-block mr-2 text-body-1">
                    {{ copyOptionValues.price }} <sup>د.ع</sup>
                  </span>
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    تكلفة الشراء :
                  </span>
                  <span class="d-inline-block mr-2">
                    {{ copyOptionValues.purchase_price }} <sup>د.ع</sup>
                  </span>
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    هل يوجد خصم؟
                  </span>
                  <span
                    v-if="copyOptionValues.is_discount"
                    class="d-inline-block mr-2 text-body-1"
                    >نعم</span
                  >
                  <span v-else class="d-inline-block mr-2 text-body-1"
                    >كلا</span
                  >
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    سعر الخصم :
                  </span>
                  <span class="d-inline-block mr-2 text-body-1">
                    {{ copyOptionValues.discount_price }} <sup>د.ع</sup>
                  </span>
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    هل الاختيار رئيسي؟
                  </span>
                  <span
                    v-if="copyOptionValues.is_main"
                    class="d-inline-block mr-2 text-body-1"
                    >نعم</span
                  >
                  <span v-else class="d-inline-block mr-2 text-body-1"
                    >كلا</span
                  >
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    رمز الاختيار:
                  </span>
                  <span class="d-inline-block mr-2 text-body-1">
                    {{ copyOptionValues.sku }}
                  </span>
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    كمية الاختيار:
                  </span>
                  <span class="d-inline-block mr-2 text-body-1">
                    {{ copyOptionValues.in_stock }}
                  </span>
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    نوع الاختيار :
                  </span>
                  <span class="d-inline-block mr-2 text-body-1">
                    {{ copyOptionValues.option.name }}
                  </span>
                </v-list-item>
                <v-list-item>
                  <v-list-item-group>
                    <span class="d-inline-block font-weight-bold text-body-1">
                      صورة الاختيار:
                    </span>

                    <v-img
                      class="thumbnail-image"
                      eager
                      :src="copyOptionValues.thumbnail.path"
                    ></v-img>
                  </v-list-item-group>
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    وصف الصوره :
                  </span>
                  <span class="d-inline-block mr-2 text-body-1">
                    {{ copyOptionValues.thumbnail.alt_text }}
                  </span>
                </v-list-item>
              </v-list>
            </v-col>
            <!-- old information display section End -->
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            class="text-body-1"
            color="primary"
            @click="saveUpdateOptionValue()"
          >
            حفظ التعديل</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false"> غلق </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- edit dialog section End -->
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  layout: "dashboard",
  async asyncData({ $axios, params }) {
    let result = await $axios.get(`api/dashboard/product/view/${params.id}`);
    let optionValuesResult = await $axios.get(
      `api/dashboard/product/${params.id}/option-values`
    );
    let optionResult = await $axios.get("api/dashboard/options");
    return {
      product: result.data,
      options: optionResult.data,
      optionValues: optionValuesResult.data,
    };
  },
  data() {
    return {
      dialog: false,
      optionValueIndex: -1,
      headers: [
        {
          value: "id",
          text: "التسلسل",
          align: "center",
          class: "font-weight-bold text-body-1",
        },
        {
          value: "name",
          text: "اسم الاختيار",
          align: "center",
          class: "font-weight-bold text-body-1",
        },
        {
          value: "price",
          text: "السعر",
          align: "center",
          class: "font-weight-bold text-body-1",
        },
        {
          value: "is_main",
          text: "الاختيار رئيسي؟",
          align: "center",
          class: "font-weight-bold text-body-1",
        },
        {
          value: "product.name",
          text: "المنتج",
          align: "center",
          class: "font-weight-bold text-body-1",
        },
        {
          value: "option.name",
          text: "نوع الاختيار",
          align: "center",
          class: "font-weight-bold text-body-1",
        },
        {
          value: "actions",
          text: "العمليات",
          align: "center",
          class: "font-weight-bold text-body-1",
        },
      ],
      rules: {
        required: (value) => !!value || "* الحقل مطلوب",
        maxName: (value) => (value && value.length <= 75) || "75 أحرف كحد أقصى",
        imageRequired: [
          (v) => !!v || "* الحقل مطلوب",
          (v) => (v && v.size > 0) || "* الحقل مطلوب",
        ],
      },
      createValid: true,
      newOptionValues: {
        name: "",
        value: "",
        price: 0,
        purchase_price: 0,
        is_discount: false,
        is_main: false,
        is_set: false,
        discount_price: 0,
        sku: 0,
        in_stock: 0,
        option_id: 0,
        thumbnail_path: null,
        thumbnail_alt_text: "",
      },
      copyOptionValues: {
        id: -1,
        name: "",
        value: "",
        price: 0,
        purchase_price: 0,
        is_discount: false,
        is_main: false,
        discount_price: 0,
        sku: 0,
        in_stock: 0,
        option: {
          name: "",
          id: -1,
        },
        thumbnail: {
          path: "",
          alt_text: "",
        },
      },
      editOptionValues: {
        name: "",
        value: "",
        price: 0,
        purchase_price: 0,
        is_discount: false,
        is_main: false,
        discount_price: 0,
        sku: 0,
        in_stock: 0,
        option_id: 0,
        thumbnail_path: null,
        thumbnail_alt_text: "",
      },
    };
  },
  methods: {
    ...mapActions(["snackbar"]),
    async saveOptionValue() {
      if (this.$refs.createForm.validate()) {
        let bodyFromData = new FormData();

        for (let dataKey in this.newOptionValues) {
          bodyFromData.append(dataKey, this.newOptionValues[dataKey]);
        }
        bodyFromData.append("product_id", this.product.id);

        let result = await this.$axios({
          method: "POST",
          url: "api/dashboard/product/option-values/create",
          data: bodyFromData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (result.status === 200) {
          this.optionValues.unshift(result.data);
          this.snackbar({
            status: true,
            message: "تمت الاضافة بنجاح",
            color: "success",
          });
        } else {
          this.snackbar({
            status: true,
            message: "لم تتم الاضافة بنجاح",
            color: "error",
          });
        }
        this.$refs.createForm.reset();
      }
    },
    async deleteOption(item) {
      let result = await this.$axios.delete(
        `api/dashboard/product/option-values/delete/${item.id}`
      );

      if (result.status === 204) {
        this.optionValues = this.optionValues.filter((el) => el.id !== item.id);
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

    editOptionValue(item) {
      this.optionValueIndex = this.optionValues.indexOf(item);
      this.copyOptionValues.id = item.id;
      this.copyOptionValues.name = item.name;
      this.copyOptionValues.value = item.value;
      this.copyOptionValues.price = item.price;
      this.copyOptionValues.purchase_price = item.purchase_price;
      this.copyOptionValues.is_discount = item.is_discount;
      this.copyOptionValues.is_main = item.is_main;
      this.copyOptionValues.discount_price = item.discount_price;
      this.copyOptionValues.in_stock = item.in_stock;
      this.copyOptionValues.sku = item.sku;
      this.copyOptionValues.option.name = item.option.name;
      this.copyOptionValues.option.id = item.option.id;
      this.copyOptionValues.thumbnail.path = item.thumbnail.path;
      this.copyOptionValues.thumbnail.alt_text = item.thumbnail.alt_text;
      this.dialog = true;
    },

    onChangeName(val) {
      this.editOptionValues.name = val;
    },
    onChangeValue(val) {
      this.editOptionValues.value = val;
    },
    onChangePrice(val) {
      this.editOptionValues.price = val;
    },
    onChangePurchasePrice(val) {
      this.editOptionValues.purchase_price = val;
    },
    onChangeIsDiscount(val) {
      this.editOptionValues.is_discount = val;
    },
    onChangeDiscountPrice(val) {
      this.editOptionValues.discount_price = val;
    },
    onChangeSku(val) {
      this.editOptionValues.sku = val;
    },
    onChangeInStock(val) {
      this.editOptionValues.in_stock = val;
    },
    onChangeIsMain(val) {
      this.editOptionValues.is_main = val;
    },
    onChangeOption(val) {
      this.editOptionValues.option_id = val;
    },
    onChangeThumbnailAltText(val) {
      this.editOptionValues.thumbnail_alt_text = val;
    },

    async saveUpdateOptionValue() {
      let bodyFormData = new FormData();
      if (
        this.editOptionValues.name &&
        this.copyOptionValues.name !== this.editOptionValues.name
      ) {
        bodyFormData.append("name", this.editOptionValues.name);
      }
      if (
        this.editOptionValues.value &&
        this.copyOptionValues.value !== this.editOptionValues.value
      ) {
        bodyFormData.append("value", this.editOptionValues.value);
      }
      if (
        this.editOptionValues.price &&
        this.copyOptionValues.price !== this.editOptionValues.price
      ) {
        bodyFormData.append("price", this.editOptionValues.price);
      }
      if (
        this.editOptionValues.purchase_price &&
        this.copyOptionValues.purchase_price !==
          this.editOptionValues.purchase_price
      ) {
        bodyFormData.append(
          "purchase_price",
          this.editOptionValues.purchase_price
        );
      }
      if (
        this.editOptionValues.is_discount &&
        this.copyOptionValues.is_discount !== this.editOptionValues.is_discount
      ) {
        bodyFormData.append("is_discount", this.editOptionValues.is_discount);
      }
      if (
        this.editOptionValues.discount_price &&
        this.copyOptionValues.discount_price !==
          this.editOptionValues.discount_price
      ) {
        bodyFormData.append(
          "discount_price",
          this.editOptionValues.discount_price
        );
      }
      if (
        this.editOptionValues.sku &&
        this.copyOptionValues.sku !== this.editOptionValues.sku
      ) {
        bodyFormData.append("sku", this.editOptionValues.sku);
      }
      if (
        this.editOptionValues.is_main &&
        this.copyOptionValues.is_main !== this.editOptionValues.is_main
      ) {
        bodyFormData.append("is_main", this.editOptionValues.is_main);
      }
      if (
        this.editOptionValues.in_stock &&
        this.copyOptionValues.in_stock !== this.editOptionValues.in_stock
      ) {
        bodyFormData.append("in_stock", this.editOptionValues.in_stock);
      }
      if (
        this.editOptionValues.option_id &&
        this.copyOptionValues.option.id !== this.editOptionValues.option_id
      ) {
        bodyFormData.append("option_id", this.editOptionValues.option_id);
      }
      if (
        this.editOptionValues.thumbnail_alt_text &&
        this.copyOptionValues.thumbnail.alt_text !==
          this.editOptionValues.thumbnail_alt_text
      ) {
        bodyFormData.append(
          "thumbnail_alt_text",
          this.editOptionValues.thumbnail_alt_text
        );
      }
      if (this.editOptionValues.thumbnail_path) {
        bodyFormData.append(
          "thumbnail_path",
          this.editOptionValues.thumbnail_path
        );
      }
      let result = await this.$axios({
        method: "PATCH",
        url: `api/dashboard/product/option-values/${this.copyOptionValues.id}/edit`,
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result.status === 200) {
        Object.assign(this.optionValues[this.optionValueIndex], result.data);
        this.snackbar({
          status: true,
          message: "تم التعديل بنجاح",
          color: "success",
        });
        this.dialog = false;
      } else {
        this.snackbar({
          status: true,
          message: "لم يتم التعديل بنجاح",
          color: "error",
        });
      }
    },
  },
};
</script>