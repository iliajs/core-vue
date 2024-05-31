<template>
  <div class="base-table">
    <div class="base-table__header">
      <div class="base-table__filters">
        <UniversalFilters
          v-model:filter-values="filterValues"
          :config="
            config
              .filter((item) => item.filterable)
              .map((item) => pick(item, ['name', 'label']))
          "
        />
      </div>
      <div class="base-table__action-button">
        <UniversalButton
          v-if="actionButtonText"
          @click="emit('click:actionButton')"
          :label="actionButtonText"
        />
      </div>
    </div>
    <DataTable
      :show-gridlines="true"
      :striped-rows="true"
      :row-hover="true"
      :value="dataFiltered"
      :sort-field="config.find((item) => item.defaultSort)?.name"
      :sort-order="
        config.find((item) => item.defaultSortOrder)?.defaultSortOrder
      "
    >
      <template v-for="column in config" :key="column.name">
        <Column
          v-if="!column.hidden"
          :field="column.name"
          :header="column.label"
          :sortable="column.sortable"
        />
      </template>
    </DataTable>
  </div>
</template>
<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import type { PropType } from "vue";
import type { UniversalTableColumn } from "@/types/tables";
import UniversalButton from "@/components/buttons/UniversalButton.vue";
import UniversalFilters from "@/components/filters/UniversalFilters.vue";
import { pick } from "lodash";
import type { UniversalFilterValues } from "@/types/filters";
import { computed, ref } from "vue";
import { prepareName } from "@/helpers/strings";

const emit = defineEmits(["click:actionButton"]);

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    required: true,
  },
  config: {
    type: Array as PropType<UniversalTableColumn[]>,
    required: true,
  },
  actionButtonText: String,
});

const filterValues = ref<UniversalFilterValues>({});

const dataFiltered = computed<any[]>(() => {
  let itemsFiltered = props.data;

  Object.entries(filterValues.value).forEach(([columnName, filterValue]) => {
    itemsFiltered = itemsFiltered.filter((item) => {
      return prepareName(item[columnName])
        .toLowerCase()
        .includes(prepareName(filterValue).toLowerCase());
    });
  });

  return itemsFiltered;
});
</script>
<style lang="scss" scoped>
@import "@/assets/variables";
.base-table {
  &__header {
    margin-bottom: $px-15;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__filters {
    //
  }

  &__action-button {
    //
  }
}
</style>