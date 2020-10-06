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

      <input
        ref="searchField"
        class="w-full h-full bg-white dark:bg-gray-700 p-4 pr-12 text-left placeholder-gray-700 dark:placeholder-gray-500 border-2 border-gray-600 rounded-xl outline-none focus:border-green-400"
        :placeholder="placeholder"
        type="search"
        :value="value"
        name="OD Search"
        @input="$emit('input', $event.target.value)"
      >

      <div
        class="absolute right-0 top-0 flex flex-row pr-3"
      >

        <svg
          v-if="!advancedSearch"
          class="w-8 h-8 mx-1 my-3 stroke-current stroke-1.5 cursor-pointer hover:stroke-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          @click="advancedSearch = true"
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
          @click="advancedSearch = false"
        >
          <polyline points="7 11 12 6 17 11" />
          <polyline points="7 17 12 12 17 17" />
        </svg>

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
        
      </div>

      <div
        v-if="advancedSearch"
        class="p-4 w-5/6 lg:w-1/2 m-auto border-2 border-t-0 border-gray-600 rounded-b-xl"
      >

        <div
          class="flex flex-row justify-between"
        >
          <label for="filename-only">Filename-only Search</label>
          <div
            class="relative w-6 h-6 p-px"
          >
            <input
              class="appearance-none w-0 h-0"
              type="checkbox"
              name="filename-only"
              id="filename-only"
              v-model="advancedOptions.filenameOnly"
            >
            <label
              class="absolute w-full h-full rounded-sm border-2  border-gray-600  outline-none focus:border-green-400 cursor-pointer"
              for="filename-only"
            >
              <svg
                v-if="advancedOptions.filenameOnly"
                class="absolute w-5 h-5 p-xs text-green-400 stroke-current stroke-4"
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
      advancedSearch: false,
      advancedOptions: {
        filenameOnly: false,
      }
    }
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
    }
  },
  mounted() {

    this.advancedSearch = this.advanced;
    if (this.focus) {
      this.$refs.searchField.focus();
    }

  }
}
</script>