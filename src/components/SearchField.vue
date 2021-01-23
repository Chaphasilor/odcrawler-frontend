<template>
  <div
    class="text-black dark:text-gray-100"
  >

    <form
      class="relative"
      method=""
      action="#"
      @submit.prevent="$emit('search')"
    >

      <!-- class="w-full h-full p-3 pr-8 text-left text-black placeholder-gray-700 bg-white border-2 border-gray-600 outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 rounded-xl focus:border-green-400" -->
      <input
        ref="searchField"
        :class="`w-full h-full bg-white dark:bg-gray-700 p-4 pr-24 text-left placeholder-gray-700 dark:placeholder-gray-500 border-2 border-gray-600 ${(advancedSearchVisible) ? `rounded-t-xl` : `rounded-xl`} outline-none focus:border-green-400`"
        :placeholder="placeholder"
        type="search"
        :value="value"
        name="OD Search"
        @input="$emit('input', $event.target.value)"
      >

      <div
        class="absolute top-0 right-0 flex flex-row pr-3"
      >
          <!-- class="absolute top-0 right-0 w-6 h-6 mx-3 my-3 cursor-pointer dark:text-gray-200" -->
        <svg
          class="w-8 h-8 mx-1 my-3 p-1 dark:text-gray-200 cursor-pointer hover:stroke-2.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
          @click="$emit(`search`)"
        >
          <title>Search</title>
          <circle cx="10" cy="10" r="7" />
          <line x1="21" y1="21" x2="15" y2="15" />
        </svg>

        <svg
          v-if="!advancedSearchVisible"
          :class="`w-8 h-8 mx-1 my-3 ${advancedSearchActive ? `text-orange-600` : ``} stroke-current stroke-1.5 cursor-pointer hover:stroke-2`"
          viewBox="0 0 24 24"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          @click="advancedSearchVisible = true"
        >
          <polyline points="7 7 12 12 17 7" />
          <polyline points="7 13 12 18 17 13" />
        </svg>

        <svg
          v-else
          class="w-8 h-8 mx-1 my-3 stroke-current stroke-1.5 cursor-pointer hover:stroke-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          @click="advancedSearchVisible = false"
        >
          <polyline points="7 11 12 6 17 11" />
          <polyline points="7 17 12 12 17 17" />
        </svg>
        
      </div>

      <div
        v-if="advancedSearchVisible"
        :class="`p-4 border-2 border-t-0 border-gray-600 rounded-b-xl`"
      >

        <div
          v-for="[key, option] of Object.entries(advancedOptions)"
          :key="key"
          class="flex flex-row justify-between py-2"
        >
          <label :for="key">{{ option.text }}</label>
          <div
            v-if="option.type === `toggle`"
            class="relative w-6 h-6 p-px"
          >
            <input
              class="w-0 h-0 appearance-none"
              type="checkbox"
              :name="key"
              :id="key"
              v-model="option.value"
            >
            <label
              class="absolute w-full h-full border-2 border-gray-600 rounded-xs outline-none cursor-pointer focus:border-green-400"
              :for="key"
            >
              <svg
                v-if="option.value"
                class="absolute w-5 h-5 text-green-400 stroke-current p-xs stroke-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </label>
          </div>
        </div>

      </div>

    </form>

    
  </div>
</template>

<script>
export default {
  name: `SearchField`,
  components: {

  },
  props: {
    value: {
      type: String,
      default: function() {
        return ``;
      }
    },
    placeholder: {
      type: String,
      default: function() {
        return `Search in all open directories...`;
      }
    },
    focus: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    advanced: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
  },
  data: function() {
    return {
      advancedSearchVisible: false,
    }
  },
  computed: {
    advancedOptions: {
      get() {
        return this.$store.getters.advancedOptions;
      },
      // set(newOptions) {
      //   this.$store.dispatch(`updateAdvancedOptions`, newOptions);
      // }
    },
    advancedSearchActive() {
      return Object.values(this.advancedOptions).reduce((active, currentOption) => {
        
        return active || (typeof currentOption.value == `string` ? currentOption.value.length > 0 : currentOption.value);
        
      }, false);
    },
  },
  watch: {
    focus: {
      handler: function(newFocusValue) {
        if (newFocusValue) {
          this.$refs.searchField.focus();
        } else {
          this.$refs.searchField.blur();
        }
      }
    },
    advancedOptions: {
      deep: true,
      handler: function() {
        // only trigger a search if already on the search page
        if (this.$route.name === `Search`) {
          this.$emit(`search`);
        }
      }
    }
  },
  mounted() {

    this.advancedSearchVisible = this.advanced;
    if (this.focus) {
      this.$refs.searchField.focus();
    }

    console.log(`this.advancedSearchActive:`, this.advancedSearchActive);

  }
}
</script>