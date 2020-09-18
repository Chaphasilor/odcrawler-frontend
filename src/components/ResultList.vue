<template>
  <div>

    <div
      class="flex flex-col overflow-auto"
    >

      <div
        class="w-full mb-2 flex flex-row"
        v-for="(link, id) of results"
        :key="id"
      >

        <div
          class="w-20 px-2 text-right flex-shrink-0"
        >
          {{ (id % pageSize === 0) ? `${Math.ceil( (id+1) / pageSize )} / ${Math.floor(results.length/pageSize)}` : `` }}
        </div>


        <LinkRow
          class="w-full p-2 border border-black rounded-lg"
          :link="link.url"
          :size="link.size"
        />

      </div>


    </div>


  </div>
</template>

<script>

import LinkRow from '@/components/LinkRow';

export default {
  name: `ResultList`,
  components: {
    LinkRow,
  },
  props: {
    results: {
      type: Array,
      default: function() {
        return [];
      }
    },
    pageSize: {
      type: Number,
      default: function() {
        return 10;
      }
    },
  }
}
</script>
