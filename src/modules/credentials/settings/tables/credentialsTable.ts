import type { UniversalTableColumn } from "@/types/tables";
import UniversalIcon from "@/components/icons/UniversalIcon.vue";
import UniversalPassword from "@/components/fields/UniversalPassword.vue";

export const credentialsTable: UniversalTableColumn[] = [
  {
    name: "id",
    label: "Id",
    hidden: true,
  },
  {
    name: "name",
    label: "Name",
    defaultSort: true,
    defaultSortOrder: 1,
    sortable: true,
    filterable: true,
  },
  {
    name: "type.name",
    label: "Type",
    filterable: true,
  },
  {
    name: "description",
    label: "Description",
    filterable: true,
  },
  {
    name: "password",
    label: "Password",
    getComponents: ({ value, emit, item }) => [
      {
        component: UniversalPassword,
        props: {
          value: value,
          entityLabel: "Password",
        },
      },
    ],
  },
  {
    name: "actions",
    label: "Actions",
    getComponents: ({ value, emit, item }) => [
      {
        component: UniversalIcon,
        props: {
          label: "edit",
          primeIcon: "pencil",
          link: true,
          onClick: () => {
            return emit("click:edit-item", item);
          },
        },
      },
      {
        component: UniversalIcon,
        props: {
          label: "delete",
          primeIcon: "trash",
          link: true,
          onClick: () => {
            return emit("click:delete-item", item);
          },
        },
      },
    ],
  },
];
