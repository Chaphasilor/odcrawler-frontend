<template>
  <div>

    <input
      class="w-full h-full p-4 text-left border-2 border-gray-600 rounded-xl outline-none focus:border-green-400"
      placeholder="Search in all open directories..."
      type="search"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
    
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
        return '';
      }
    },
  }
}
</script>