<template>
  <div
    v-infinite-scroll="() => this.$emit(`end-of-list`)"
    :infinite-scroll-disabled="disableInfiniteScroll"
    infinite-scroll-distance="5"
    infinite-scroll-throttle-delay="500"
  >

    <div
      class="flex flex-col w-full overflow-auto"
    >

      <div
        class="flex-row w-full md:mb-2 md:flex"
        v-for="(link, id) of results.hits"
        :key="id"
      >

        <div
          class="flex-shrink-0 w-auto my-1 font-bold text-center md:w-20 md:pt-2 md:pr-2 md:font-normal md:text-right"
          :ref="`page-${(id % pageSize === 0) ? calcPage(id) : `${calcPage(id)}-${id - calcPage(id)*pageSize}`}`"
        >
          {{ (id % pageSize === 0) ? `${calcPage(id)}/${Math.ceil(results.totalHits/pageSize)}` : ``}}
        </div>


        <LinkRow
          class="w-full p-2 pt-1 mb-3 border border-black rounded-lg md:m-0 md:p-2 dark:border-gray-700"
          :link="link.url"
          :highlights="link.highlights"
          :size="link.size"
          @link-mounted="calcPage(id) === scrollToInitialPage ? smoothScrollToPage(calcPage(id)) : false;"
        />

      </div>

      <!-- <div
        class="w-full text-lg font-bold text-center"
      >
        {{ bottomText }}
      </div> -->

      <div
        class="flex flex-row w-full mb-2"
      >

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
    },
  },
  methods: {
    smoothScrollToPage(page) {

      console.log(`page:`, page);
      this.$refs[`page-${page}`][0].scrollIntoView({
        behavior: `smooth`,
      });
      
    },
    calcPage(linkNumber) {
      return Math.ceil( (linkNumber + (this.lowestPage)*this.pageSize ) / this.pageSize );
    },
    log(text) {
      console.log(text);
    }
  },
  mounted() {

    console.log(`this.disableInfiniteScroll:`, this.disableInfiniteScroll);

  }
}
</script>
