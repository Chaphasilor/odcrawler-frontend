<template>
  <div
    v-infinite-scroll="() => this.$emit(`end-of-list`)"
    infinite-scroll-distance="5"
    infinite-scroll-throttle-delay="500"
  >

    <div
      class="w-full flex flex-col overflow-auto"
    >

      <div
        class="w-full mb-2 flex flex-row"
        v-for="(link, id) of results.hits"
        :key="id"
      >

        <div
          class="w-20 p-2 text-right flex-shrink-0"
        >
          {{ (id % pageSize === 0) ? `${Math.ceil( (id+1) / pageSize )} / ${Math.floor(results.totalHits/pageSize)+1}` : `` }}
        </div>


        <LinkRow
          class="w-full p-2 border border-black dark:border-gray-700 rounded-lg"
          :link="link.url"
          :highlights="link.highlights"
          :size="link.size"
        />

      </div>

      <div
        class="w-full font-bold text-lg text-center"
      >
        {{ bottomText }}
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
      type: Object,
      required: true,
    },
    pageSize: {
      type: Number,
      default: function() {
        return 10;
      }
    },
    bottomText: {
      type: String,
      default: function() {
        return ``;
      }
    },
  },
  // methods: {
  //   loadNextPage() {

  //     this.$emit(`end-of-list`);

  //   }
  // }
}
</script>
