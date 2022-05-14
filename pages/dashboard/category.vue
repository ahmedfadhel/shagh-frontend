<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-0">
          <v-card-title class="font-weight-bold text-h5 teal white--text pa-5">
            <h1>الاقسام</h1>
            <!-- العلامات الموسومة -->
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="pa-5">
      <v-row>
        <v-col cols="12" md="4">
          <v-form>
            <v-text-field
              label="الاسم"
              outlined
              v-model="category.name"
            ></v-text-field>
            <v-textarea
              label="وصف القسم"
              outlined
              v-model="category.description"
            ></v-textarea>
            <v-file-input
              label="صورة القسم"
              class="mt-3"
              outlined
              prepend-inner-icon="mdi-camera"
              prepend-icon=""
              v-model="category.thumbnail"
            ></v-file-input>
            <v-btn
              color="primary"
              block
              x-large
              class="text-h6"
              @click="saveCategory()"
            >
              حفظ القسم</v-btn
            >
          </v-form>
        </v-col>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title
              class="font-weight-bold text-h5 blue lighten-3 white--text"
            >
              الاقسام
            </v-card-title>
            <v-divider></v-divider>
            <v-data-table :headers="headers" :items="categories">
              <template v-slot:item.thumbnail="{ item }">
                <div class="pa-2">
                  <img
                    :src="item.thumbnail"
                    :alt="item.name"
                    height="100"
                    width="100"
                    class="thumbnail-image"
                  />
                </div>
              </template>
              <template v-slot:item.name="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.name }}
                </td>
              </template>
              <template v-slot:item.description="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.description }}
                </td>
              </template>
              <template v-slot:item.slug="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.slug }}
                </td>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="primary"
                  outlined
                  small
                  class="text-body-1"
                  @click="editCategory(item)"
                >
                  <v-icon small> mdi-pencil </v-icon>
                  تعديل
                </v-btn>
                <v-btn
                  color="error"
                  outlined
                  small
                  class="text-body-1"
                  @click="deleteCategory(item)"
                >
                  <v-icon small> mdi-delete </v-icon>
                  حذف
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="dialog" width="800">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          تعديل العلامة الموسومة ({{ this.editCategoryItem.name }})
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-form class="mt-6">
                <v-text-field
                  label="الاسم"
                  outlined
                  :value="editCategoryItem.name"
                  @change="onChangeName"
                  ref="catName"
                  name="name"
                ></v-text-field>
                <v-textarea
                  label="الوصف"
                  outlined
                  :value="editCategoryItem.description"
                  ref="catDescription"
                  name="description"
                  @change="onChnageDescription"
                >
                </v-textarea>
                <v-file-input
                  outlined
                  label="صورة القسم"
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  v-model="newCategory.thumbnail"
                ></v-file-input>
              </v-form>
            </v-col>
            <v-col cols="12" md="6">
              <v-list>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    اسم القسم :
                  </span>
                  <span class="d-inline-block text-body-1">
                    {{ this.editCategoryItem.name }}
                  </span>
                </v-list-item>
                <v-list-item>
                  <span class="d-inline-block font-weight-bold text-body-1">
                    وصف القسم :
                  </span>
                  <span class="d-inline-block text-body-1">
                    {{ this.editCategoryItem.description }}
                  </span>
                </v-list-item>
                <v-list-item>
                  <v-img
                    :src="this.editCategoryItem.thumbnail"
                    contain
                    class="thumbnail-image"
                  ></v-img>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            class="text-body-1"
            color="primary"
            @click="saveUpdateCategory()"
          >
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
    let result = await $axios.get("api/dashboard/category");
    let categories = result.data;
    return { categories };
  },
  data() {
    return {
      dialog: false,
      category: {
        name: "",
        description: "",
        thumbnail: null,
      },
      editCategoryItem: {
        name: null,
        description: null,
      },
      newCategory: {
        name: null,
        description: null,
        thumbnail: null,
      },
      editCategoryIndex: -1,
      headers: [
        {
          text: "صورة القسم",
          value: "thumbnail",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
        {
          text: "اسم القسم",
          value: "name",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
        {
          text: "وصف القسم",
          value: "description",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
        {
          text: "رابط القسم",
          value: "slug",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
        {
          text: "التحكم",
          value: "actions",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
      ],
    };
  },
  methods: {
    ...mapActions(["snackbar"]),
    async saveCategory() {
      let bodyFormData = new FormData();
      bodyFormData.append("name", this.category.name);
      bodyFormData.append("description", this.category.description);
      bodyFormData.append("thumbnail", this.category.thumbnail);
      let result = await this.$axios({
        method: "post",
        url: "api/dashboard/category/create",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result.status === 201) {
        this.categories.unshift(result.data);
        this.snackbar({
          status: true,
          color: "success",
          message: "تمت الاضافة بنجاح",
        });
        this.category.name = "";
        this.category.description = "";
        this.category.thumbnail = null;
      } else {
        this.snackbar({
          status: false,
          color: "error",
          message: " لم تتم الاضافة ",
        });
      }
      console.log(result);
    },
    editCategory(item) {
      this.editCategoryIndex = this.categories.indexOf(item);
      this.editCategoryItem = {
        id: item.id,
        name: item.name,
        description: item.description,
        thumbnail: item.thumbnail,
      };
      this.dialog = true;
    },
    async deleteCategory(item) {
      let result = await this.$axios.delete(
        `api/dashboard/category/delete/${item.id}`,
        {
          headers: {
            "Content-Type": "Application/json",
          },
        }
      );
      if (result.status === 204) {
        this.categories = this.categories.filter((ele) => ele.id !== item.id);
        this.snackbar({
          status: true,
          color: "success",
          message: "تمت الازالة بنجاح",
        });
      } else {
        this.snackbar({
          status: true,
          color: "error",
          message: "لم تتم الازالة بنجاح",
        });
      }
    },
    onChangeName(val) {
      if (this.$refs.catName.$attrs.name === "name") {
        this.newCategory.name = val;
      }
    },
    onChnageDescription(val) {
      if (this.$refs.catDescription.$attrs.name === "description") {
        this.newCategory.description = val;
      }
    },
    async saveUpdateCategory() {
      let bodyFormData = new FormData();
      if (
        this.newCategory.name &&
        this.newCategory.name !== this.editCategoryItem.name
      ) {
        bodyFormData.append("name", this.newCategory.name);
      }
      if (
        this.newCategory.description &&
        this.newCategory.description !== this.editCategoryItem.description
      ) {
        bodyFormData.append("description", this.newCategory.description);
      }
      if (this.newCategory.thumbnail) {
        bodyFormData.append("thumbnail", this.newCategory.thumbnail);
      }
      for (var value of bodyFormData.values()) {
        console.log(value);
      }
      let result = await this.$axios({
        method: "PATCH",
        url: `api/dashboard/category/${this.editCategoryItem.id}/edit`,
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.status === 200) {
        if (this.editCategoryIndex > -1) {
          Object.assign(this.categories[this.editCategoryIndex], result.data);
          this.snackbar({
            status: true,
            color: "success",
            message: "تم التعديل بنجاح",
          });
          this.dialog = false;
        } else {
          this.snackbar({
            status: true,
            color: "error",
            message: "لم يتم التعديل بنجاح",
          });
          this.dialog = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.thumbnail-image {
  border: 2px solid #aaa;
  padding: 1px;
  border-radius: 5px;
}
</style>