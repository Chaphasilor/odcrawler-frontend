<template>
  <div>

    <form
      class="relative"
      method=""
      action="#"
      @submit.prevent="$emit('search')"
    >

      <input
        ref="searchField"
        class="w-full h-full bg-white dark:bg-gray-700 p-3 pr-6 text-left text-black dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-500 border-2 border-gray-600 rounded-xl outline-none focus:border-green-400"
        :placeholder="placeholder"
        type="search"
        :value="value"
        name="OD Search"
        @input="$emit('input', $event.target.value)"
      >

      <svg
        class="absolute right-0 top-0 mx-3 my-3 w-6 h-6 dark:text-gray-200 cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        @click="$emit(`search`)"
      >
        <title>Search</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="10" cy="10" r="7" />
        <line x1="21" y1="21" x2="15" y2="15" />
      </svg>

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