<template>
  <v-container>
    <v-row class="px-5">
      <v-col md="6">
        <h1>الطلبات</h1>
      </v-col>
      <v-col md="6" class="text-left">
        <v-btn color="primary" class="text-h6" large> اضافة طلب جديد </v-btn>
      </v-col>
    </v-row>
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-data-table :headers="headers" :items="orders">
              <template v-slot:item.name="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.name }}
                </td>
              </template>
              <template v-slot:item.phone="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.phone }}
                </td>
              </template>
              <template v-slot:item.total="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.total | addNumberComma }}
                  <sup>د.ع</sup>
                </td>
              </template>
              <template v-slot:item.status="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.status }}
                </td>
              </template>
              <template v-slot:item.date="{ item }">
                <td class="font-weight-bold text-center text-body-1">
                  {{ item.date }}
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
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
export default {
  layout: "dashboard",
  data() {
    return {
      headers: [
        {
          text: "الاسم",
          value: "name",
          class: "font-weight-bold text-h6",
          align: "center",
        },
        {
          text: "رقم الهاتف",
          value: "phone",
          class: "font-weight-bold text-h6",
          align: "center",
        },
        {
          text: "قيمة الطلب",
          value: "total",
          class: "font-weight-bold text-h6",
          align: "center",
        },
        {
          text: "حالة الطلب",
          value: "status",
          class: "font-weight-bold text-h6",
          align: "center",
        },
        {
          text: "التاريخ",
          value: "date",
          class: "font-weight-bold text-h6",
          align: "center",
        },
        {
          text: "العمليات",
          value: "actions",
          class: "font-weight-bold text-h6",
          align: "center",
        },
      ],
      orders: [
        {
          name: "اسم العميل الاول",
          phone: "07710029217",
          total: 50000,
          status: "تم الاستلام",
          date: "20-10-2022",
        },
        {
          name: "اسم العميل الثاني",
          phone: "07710029217",
          total: 50000,
          status: "تم التجهيز",
          date: "6-2-2022",
        },
        {
          name: "اسم العميل الثالث",
          phone: "07710029217",
          total: 50000,
          status: "تم التسليم",
          date: "20-10-2022",
        },
      ],
    };
  },
  filters: {
    addNumberComma: function (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  methods: {
    editCategory(item) {
      console.log("edit", item);
    },
  },
};
</script>