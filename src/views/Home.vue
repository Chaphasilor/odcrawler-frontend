<template>
  <div
    class="w-full h-full p-4"
  >

    <vue-headful
      title="ODCrawler"
    />

    <div
      class="flex flex-row justify-between w-full h-auto font-semibold md:p-4 md:absolute md:top-0 md:left-0"
    >

      <a
        class="text-lg hover:text-green-400"
        href="https://github.com/sponsors/MCOfficer"
      >
        Support Us!
      </a>

      <nav
        class="flex flex-col text-lg text-right md:flex-row"
      >
        <div
          v-for="(link, index) of navLinks"
          :key="link.title"
        >

          <div
            class="pb-2"
          >

            <router-link
              :to="link.to"
            >

              <span
                class="hover:text-green-400"
              >
                {{ link.title }}
              </span>

            </router-link>
            
            <svg
              v-if="index != navLinks.length-1"
              class="hidden w-4 h-4 mr-1 md:inline-block"
              viewBox="0 0 24 24"
            
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <circle cx="12" cy="12" r="4" />
            </svg>
            
          </div>

        </div>
      </nav>
      
    </div>

    <div
      class="w-full h-full"
    >

      <div
        class="flex flex-col justify-center flex-shrink-0 w-full md:h-full"
      >

        <LogoHeader
          class="md:-mt-10"
          :showDescription="true"
        />

        <SearchField
          class="w-full max-w-3xl mx-auto mt-2 mb-4 md:my-4"
          v-model="searchQuery"
          :focus="true"
          :placeholder="`Search ${stats.totalIndexed || `millions of`} links${isLandscape ? ` in ${stats.aliveODs} open directories` : ``}...`"
          @search="
            searchQuery.length > 0 ?
            $router.push({
              name: `Search`,
              params: {
                query: searchQuery,
              }
            }) :
            false
          "
        />

        <p
          class="w-full px-2 mx-auto mb-4 text-xs italic text-center text-gray-800 sm:px-10 md:w-192 md:text-sm dark:text-gray-600"
        >
          Links are automatically aggregated from all over the Internet. Malicious/infected, illegal, offensive, violent, disturbing or otherwise harmful content might be linked, but is in no way promoted or endorsed. If you have a problem with a link, please contact the owner of the hosting website which the link points to.
        </p>

      </div>

      <div
        class="flex-shrink-0 w-full p-8 text-center md:fixed md:bottom-0 md:left-0"
      >

        <div
          class="m-auto font-semibold md:text-lg"
        >
          <div
            class="font-normal display-block"
          >
            Powered by:
          </div>

          <div
            class="flex-row flex-wrap justify-center md:flex"
          >

            <div
              v-for="(item, index) of poweredBy"
              :key="index"
            >
              <a
                class="text-blue-600 underline dark:text-blue-400 hover:text-green-400"
                :href="item.url"
                rel="noopener noreferrer"
                target="_blank"
              >
              <svg
                v-if="item.icon"
                v-html="item.icon.paths"
                :stroke="item.icon.color"
                class="inline-block h-6 mr-1"
                viewBox="0 0 24 24"
              
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>{{item.title}}</a>
              
              <svg
                v-if="index != poweredBy.length-1"
                class="hidden w-4 h-4 mx-1 md:inline-block"
                viewBox="0 0 24 24"
              
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>

          </div>

        </div>
        
      </div>

    </div>

  </div>
</template>

<script>

import SearchField from '@/components/SearchField';
import LogoHeader from '@/components/LogoHeader';

export default {
  name: `Home`,
  components: {
    SearchField,
    LogoHeader,
  },
  data: function() {
    return {
      searchQuery: ``,
      resultListBottomText: ``,
      navLinks: [
        {
          title: `Contact`,
          to: {
            name: `Contact`,
          }
        },
        {
          title: `Download All Links`,
          to: {
            name: `Download`,
          }
        },
      ],
      poweredBy: [
        {
          title: `OpenDirectoryDownloader`,
          url: `https://github.com/KoalaBear84/OpenDirectoryDownloader/`,
        },
        {
          title: `Elasticsearch`,
          url: `https://www.elastic.co/elasticsearch/`,
        },
        {
          title: `Tabler Icons`,
          url: `https://tablericons.com/`,
          // icon: {
          //   paths: `
          //     <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          //     <path d="M8 9l3 3l-3 3" />
          //     <line x1="13" y1="15" x2="16" y2="15" />
          //     <rect x="4" y="4" width="16" height="16" rx="4" />
          //   `,
          //   color: `#318BEF`,
          // },
        },
        {
          title: `Netlify`,
          url: `https://www.netlify.com/`,
        },
        {
          title: `VueJS`,
          url: `https://vuejs.org/`,
        },
        {
          title: `Tailwind CSS`,
          url: `https://tailwindcss.com/`,
        },
      ],
      orientation: window.screen.orientation ? window.screen.orientation.type : `landscape-primary`,
    };
  },
  computed: {
    stats: function() {
      return this.$store.getters.stats;
    },
    isIndexing: function() {
      return this.stats.isIndexing;
    },
    isLandscape: function() {
      console.log(`this.orientation:`, this.orientation)
      return this.orientation === 'landscape-primary';
    },
  },
  methods: {

  },
  mounted() {

    this.$store.dispatch(`analytics/trackView`, `/`);

  },
}
</script>
