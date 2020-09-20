<template>
  <div>

    <div
      class="relative"
    >

      <input
        ref="searchField"
        class="w-full h-full bg-white dark:bg-gray-700 p-3 pr-12 text-left text-black dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-500 border-2 border-gray-600 rounded-xl outline-none focus:border-green-400"
        :placeholder="placeholder"
        type="search"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @keydown.enter="$emit('search')"
      >

      <svg
        class="absolute right-0 top-0 mx-6 my-3 w-6 h-6 text-black dark:text-gray-200 cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        @click="$emit('search')"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

    </div>

    
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

    if (this.focus) {
      this.$refs.searchField.focus();
    }

  }
}
</script>