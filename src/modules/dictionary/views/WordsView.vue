<template>
  <div class="words-view">
    <div class="words-view__top">
      <div class="words-view__top-left">
        <WordSorting />
        <WordFiltering />
      </div>
      <div class="words-view__top-button">
        <Button
          :label="$lang.button.manageTags"
          @click="openManageTagsSidebar"
          outlined
          size="small"
        />
      </div>
    </div>
    <div class="words-view__words">
      <PlusTile @click="onClickAddWord" />
      <WordTile
        v-for="(item, index) in wordsSortedAndFiltered"
        :key="item.id"
        :data="item"
        :background-color="getPaletteColor(index)"
        @on-click="onClickWord(item.id)"
        @on-click-delete="onClickDelete(item)"
        @change-tags="loadWords"
      />
    </div>
  </div>
  <CustomConfirmDialog
    v-model="deleteItem"
    :type="DialogType.Confirm"
    :text="lang.title.confirmDeleteWord(deleteItem?.title ?? '')"
    :confirm-button-text="$lang.button.delete"
    @on-cancel="onCancelDelete"
    @on-confirm="onConfirmDelete"
  />
  <ManageTagsDrawer ref="manageTagsSidebar" />
  <WordSidebar ref="wordSidebar" />
  <CreateWordSidebar ref="addWordSidebar" @create:word="loadWords" />
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { computed, onBeforeMount, ref } from "vue";
import { apiPaths } from "@/settings/api";
import Api from "@/api/Api";
import { getPaletteColor } from "@/settings/colorPalette";
import type { ApiWordResponse } from "@/types/word";
import WordTile from "@/modules/dictionary/components/WordTile.vue";
import Button from "primevue/button";
import PlusTile from "@/modules/dictionary/components/PlusTile.vue";
import WordSorting from "@/modules/dictionary/components/WordSorting.vue";
import { RequestMethods } from "@/types/api";
import { lang } from "@/lang";
import CustomConfirmDialog from "@/components/dialogs/CustomConfirmDialog.vue";
import { DialogType } from "@/types/dialog";
import { orderBy } from "lodash";
import { SortingOptions, useWordsAppStore } from "@/store/wordsAppStore";
import { storeToRefs } from "pinia";
import ManageTagsDrawer from "@/modules/dictionary/components/sidebars/ManageTagsDrawer.vue";
import WordFiltering from "@/modules/dictionary/components/WordFiltering.vue";
import { useTagsFilteringStore } from "@/store/tagsFilteringStore";
import WordSidebar from "@/modules/dictionary/components/sidebars/WordSidebar.vue";
import CreateWordSidebar from "@/modules/dictionary/components/sidebars/CreateWordSidebar.vue";

const wordsAppStore = useWordsAppStore();
const tagsFilteringStore = useTagsFilteringStore();

const { selectedSorting, selectedSortingDirection } =
  storeToRefs(wordsAppStore);

const { filterTags } = storeToRefs(tagsFilteringStore);

const manageTagsSidebar = ref();
const words = ref([] as ApiWordResponse[]);
const deleteItem: Ref<ApiWordResponse | null> = ref(null);
const wordSidebar = ref();
const addWordSidebar = ref();

onBeforeMount(async () => {
  await loadWords();
});

const wordsSortedAndFiltered = computed<ApiWordResponse[]>(() => {
  const wordsFiltered = filterTags.value.length
    ? words.value.filter(
        (item) =>
          !item.tags.length ||
          item.tags.some((el) => filterTags.value.includes(el.id))
      )
    : words.value;

  switch (selectedSorting.value) {
    case SortingOptions.ByTranslatedTimes:
      return orderBy(
        wordsFiltered,
        (item) => item.translations.length,
        selectedSortingDirection.value
      );
    case SortingOptions.ById:
    default:
      return orderBy(wordsFiltered, "id", selectedSortingDirection.value);
  }
});

const loadWords = async (): Promise<void> => {
  const data = await Api.request({
    path: apiPaths.word,
  });

  words.value = data?.length ? (data as ApiWordResponse[]) : [];
};
const onClickWord = (wordId: string): void => {
  wordSidebar.value.open(wordId);
};

const onClickAddWord = (): void => {
  addWordSidebar.value.open();
};

const onClickDelete = async (item: ApiWordResponse): Promise<void> => {
  deleteItem.value = item;
};

const onCancelDelete = () => {
  deleteItem.value = null;
};

const onConfirmDelete = async (): Promise<void> => {
  if (!deleteItem.value) {
    return;
  }

  const { id, title } = deleteItem.value;

  await Api.request({
    method: RequestMethods.Delete,
    path: `${apiPaths.word}/${id}`,
    successToast: lang.success.wordDeleted(title),
    successCallback: () => {
      loadWords();
    },
  });

  deleteItem.value = null;
};

const openManageTagsSidebar = () => {
  manageTagsSidebar.value.open();
};
</script>
<style lang="scss" scoped>
@import "@/assets/variables";

@mixin flex-wrap-fix($flex-basis, $max-viewport-width: 2000px) {
  flex-grow: 1;
  flex-basis: $flex-basis;
  max-width: 100%;

  $multiplier: 1;
  $current-width: 0px;

  @while $current-width < $max-viewport-width {
    $current-width: $current-width + $flex-basis;
    $multiplier: $multiplier + 1;

    @media (min-width: $flex-basis * $multiplier) {
      max-width: calc(1 / $multiplier);
    }
  }
}

.words-view {
  padding: 0 $px-60;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $px-15;
  }

  &__top-left {
    display: flex;
    gap: $px-20;
  }

  &__top-button {
    //:deep(.p-button) {
    //  font-size: 0.9em;
    //  padding: 0;
    //}
  }

  &__words {
    display: flex;
    flex-wrap: wrap;
    gap: $px-30;

    div {
      min-width: 350px;
      @include flex-wrap-fix(250px);
    }
  }
}
</style>
