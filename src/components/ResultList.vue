<template>
  <div
    v-infinite-scroll="() => this.$emit(`end-of-list`)"
    :infinite-scroll-disabled="disableInfiniteScroll"
    infinite-scroll-distance="5"
    infinite-scroll-throttle-delay="500"
  >

    <div
      class="w-full flex flex-col overflow-auto"
    >

      <div
        class="w-full md:mb-2 md:flex flex-row"
        v-for="(link, id) of results.hits"
        :key="id"
      >

        <div
          class="w-auto my-1 md:w-20 md:pt-2 md:pr-2 font-bold md:font-normal text-center md:text-right flex-shrink-0"
        >
          {{ (id % pageSize === 0) ? `${Math.ceil( (id + (lowestPage)*pageSize ) / pageSize )}/${Math.floor(results.totalHits/pageSize)+1}` : ``}}
        </div>


        <LinkRow
          class="w-full pt-1 p-2 mb-3 md:m-0 md:p-2 border border-black dark:border-gray-700 rounded-lg"
          :link="link.url"
          :highlights="link.highlights"
          :size="link.size"
        />

      </div>

      <!-- <div
        class="w-full font-bold text-lg text-center"
      >
        {{ bottomText }}
      </div> -->

      <div
        class="w-full mb-2 flex flex-row"
      >

        <div
          class="md:w-20 p-2 text-right flex-shrink-0"
        ></div>

        <div
          :class="`w-full p-2 text-center mb-4 ${message.level === `warning` ? `bg-orange-500 dark:bg-orange-800` : message.level === `error` ? `bg-red-500 dark:bg-red-800` : ``} rounded-lg`"
        >
          {{ message.text }}
        </div>

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
    message: {
      type: Object,
      default: function() {
        return {
          text: ``,
          level: `normal`,
        };
      }
    },
    disableInfiniteScroll: {
      type: Boolean,
      default: function() {
        false;
      }
    },
    lowestPage: {
      type: Number,
      default: function() {
        return 1;
      }
    },
    scrollToInitialPage: {
      type: Number,
      default: function() {
        return 1;
      }
    },
  },
  watch: {
    disableInfiniteScroll: {
      handler: function() {
        console.log(`this.disableInfiniteScroll:`, this.disableInfiniteScroll);
      }
    }
  },
  methods: {
    // smoothScrollToPage(page) {

    //   console.log(`page:`, page);
      
    // }
  },
  mounted() {

    // this.smoothScrollToPage(this.scrollToInitialPage);
    console.log(`this.disableInfiniteScroll:`, this.disableInfiniteScroll);
    
  }
}
</script>
