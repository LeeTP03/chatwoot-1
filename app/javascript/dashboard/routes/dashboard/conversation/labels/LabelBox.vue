<script>
import { ref } from 'vue';
import { mapGetters } from 'vuex';
import { useAdmin } from 'dashboard/composables/useAdmin';
import { useKeyboardEvents } from 'dashboard/composables/useKeyboardEvents';
import Spinner from 'shared/components/Spinner.vue';
import LabelDropdown from 'shared/components/ui/label/LabelDropdown.vue';
import AddLabel from 'shared/components/ui/dropdown/AddLabel.vue';
import conversationLabelMixin from 'dashboard/mixins/conversation/labelMixin';

export default {
  components: {
    Spinner,
    LabelDropdown,
    AddLabel,
  },

  mixins: [conversationLabelMixin],
  props: {
    // conversationId prop is used in /conversation/labelMixin,
    // remove this props when refactoring to composable if not needed
    // eslint-disable-next-line vue/no-unused-properties
    conversationId: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { isAdmin } = useAdmin();

    const conversationLabelBoxRef = ref(null);
    const showSearchDropdownLabel = ref(false);

    const toggleLabels = () => {
      showSearchDropdownLabel.value = !showSearchDropdownLabel.value;
    };

    const closeDropdownLabel = () => {
      showSearchDropdownLabel.value = false;
    };

    const keyboardEvents = {
      KeyL: {
        action: e => {
          e.preventDefault();
          toggleLabels();
        },
      },
      Escape: {
        action: () => {
          if (showSearchDropdownLabel.value) {
            toggleLabels();
          }
        },
        allowOnFocusedInput: true,
      },
    };
    useKeyboardEvents(keyboardEvents, conversationLabelBoxRef);
    return {
      isAdmin,
      conversationLabelBoxRef,
      showSearchDropdownLabel,
      closeDropdownLabel,
      toggleLabels,
    };
  },
  data() {
    return {
      selectedLabels: [],
    };
  },

  computed: {
    ...mapGetters({
      conversationUiFlags: 'conversationLabels/getUIFlags',
    }),
  },
};
</script>

<template>
  <div ref="conversationLabelBoxRef" class="sidebar-labels-wrap">
    <div
      v-if="!conversationUiFlags.isFetching"
      class="contact-conversation--list"
    >
      <div
        v-on-clickaway="closeDropdownLabel"
        class="label-wrap"
        @keyup.esc="closeDropdownLabel"
      >
        <AddLabel @add="toggleLabels" />
        <woot-label
          v-for="label in activeLabels"
          :key="label.id"
          :title="label.title"
          :description="label.description"
          show-close
          :color="label.color"
          variant="smooth"
          class="max-w-[calc(100%-0.5rem)]"
          @click="removeLabelFromConversation"
        />

        <div class="dropdown-wrap">
          <div
            :class="{ 'dropdown-pane--open': showSearchDropdownLabel }"
            class="dropdown-pane"
          >
            <LabelDropdown
              v-if="showSearchDropdownLabel"
              :account-labels="accountLabels"
              :selected-labels="savedLabels"
              :allow-creation="isAdmin"
              @add="addLabelToConversation"
              @remove="removeLabelFromConversation"
            />
          </div>
        </div>
      </div>
    </div>
    <Spinner v-else />
  </div>
</template>

<style lang="scss" scoped>
.sidebar-labels-wrap {
  margin-bottom: 0;
}
.contact-conversation--list {
  width: 100%;

  .label-wrap {
    line-height: var(--space-medium);
    position: relative;

    .dropdown-wrap {
      display: flex;
      left: -1px;
      margin-right: var(--space-medium);
      position: absolute;
      top: var(--space-medium);
      width: 100%;

      .dropdown-pane {
        width: 100%;
        box-sizing: border-box;
      }
    }
  }
}

.error {
  color: var(--r-500);
  font-size: var(--font-size-mini);
  font-weight: var(--font-weight-medium);
}
</style>
