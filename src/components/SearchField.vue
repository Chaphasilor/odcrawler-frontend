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
        class="w-full h-full p-3 pr-8 text-left text-black placeholder-gray-700 bg-white border-2 border-gray-600 outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 rounded-xl focus:border-green-400"
        :placeholder="placeholder"
        type="search"
        :value="value"
        name="OD Search"
        @input="$emit('input', $event.target.value)"
      >

      <svg
        class="absolute top-0 right-0 w-6 h-6 mx-3 my-3 cursor-pointer dark:text-gray-200"
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