<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-0">
          <v-card-title class="font-weight-bold text-h5 teal white--text pa-5">
            <h1>العلامات الموسومة</h1>
            <!-- العلامات الموسومة -->
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="pa-5">
      <v-card-title class="font-weight-bold text-h6">
        أضافة علامة جديده
      </v-card-title>
      <v-row>
        <v-col cols="12" md="4">
          <v-form>
            <v-text-field
              label="الاسم"
              outlined
              v-model="tag.name"
            ></v-text-field>

            <v-btn
              color="primary"
              block
              x-large
              class="text-h6"
              @click="saveTag()"
            >
              حفظ العلامة الموسومة</v-btn
            >
          </v-form>
        </v-col>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title
              class="font-weight-bold text-h5 blue lighten-3 white--text"
            >
              العلامات الموسومة
            </v-card-title>
            <v-divider></v-divider>
            <v-data-table :headers="headers" :items="tags">
              <template v-slot:item.name="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.name }}
                </td>
              </template>
              <template v-slot:item.slug="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.slug }}
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
                  @click="editTag(item)"
                >
                  <v-icon small> mdi-pencil </v-icon>
                  تعديل
                </v-btn>
                <v-btn
                  color="error"
                  outlined
                  small
                  class="text-body-1"
                  @click="deleteTag(item)"
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
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          تعديل العلامة الموسومة ({{ this.editedTag.name }})
        </v-card-title>

        <v-card-text>
          <v-form class="mt-6">
            <v-text-field
              label="الاسم"
              outlined
              v-model="editedTag.name"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="text-body-1" color="primary" @click="saveEditedTag()">
            حفظ التعديل</v-btn
          >
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
    let fetchTags = await $axios.get("api/dashboard/tags");
    let tags = fetchTags.data;
    return { tags };
  },
  data() {
    return {
      tag: {
        name: "",
      },
      dialog: false,
      editedTagIndex: -1,
      editedTag: {
        name: "",
      },
      headers: [
        {
          text: "اسم العلامة الموسومة",
          value: "name",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
        {
          text: "رابط العلامة الموسومة",
          value: "slug",
          class: "text-h6 font-weight-bold",
          align: "center",
        },
        {
          text: "تاريخ الانشاء",
          value: "updated_at",
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
    editTag(item) {
      this.editedTagIndex = this.tags.indexOf(item);
      this.editedTag = Object.assign({}, item);
      this.dialog = true;
    },
    async saveTag() {
      let result = await this.$axios.post(
        "api/dashboard/tags/create",
        {
          name: this.tag.name,
        },
        {
          headers: {
            "Content-Type": "Application/json",
          },
        }
      );
      if (result.status === 201) {
        this.tags.push(result.data);
        this.snackbar({
          status: true,
          color: "success",
          message: "تمت الاضافة بنجاح",
        });
      }
    },
    async deleteTag(item) {
      let result = await this.$axios.delete(
        `api/dashboard/tags/delete/${item.id}`,
        {
          headers: {
            "Content-Type": "Application/json",
          },
        }
      );
      if (result.status === 204) {
        this.tags = this.tags.filter((ele) => ele.id !== item.id);
        this.snackbar({
          status: true,
          color: "success",
          message: "تمت الحذف بنجاح",
        });
      }
    },
    async saveEditedTag() {
      let result = await this.$axios.patch(
        `api/dashboard/tags/${this.editedTag.id}/edit`,
        {
          name: this.editedTag.name,
        },
        {
          headers: {
            "Content-Type": "Application/json",
          },
        }
      );
      if (result.status === 200) {
        if (this.editedTagIndex > -1) {
          Object.assign(this.tags[this.editedTagIndex], result.data);
        }
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
    },
  },
};
</script>