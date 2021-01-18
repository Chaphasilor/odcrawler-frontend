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
        class="flex flex-col text-lg text-right md:block"
      >
        <router-link
          class="pb-2"
          v-for="(link, index) of navLinks"
          :key="link.title"
          :to="link.to"
        >

        <span
          class="hover:text-green-400"
        >
          {{ link.title }}
        </span>
        
          <svg
            v-if="index != navLinks.length-1"
            class="w-4 h-4 mx-1 md:inline-block"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="4" />
          </svg>

        </router-link>
      </nav>
      
    </div>

    <div
      class="w-full h-full"
    >

      <div
        class="flex flex-col justify-center flex-shrink-0 w-full md:h-full"
      >

        <div
          class="flex-shrink-0 w-full mt-10 text-center"
        >

          <svg
            class="w-20 h-20 m-auto dark:text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>{{ isIndexing ? `Currently indexing new links!` : `Not indexing right now...` }}</title>

            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>

          <router-link
            :to="{
              name: `Home`,
            }"
          >
            <h1
              class="inline-block text-3xl font-semibold cursor-pointer"
            >
              ODCrawler
            </h1>
          </router-link>
          
        </div>

        <SearchField
          class="w-full mx-auto mt-10 mb-4 md:my-4 md:w-192"
          v-model="searchQuery"
          :focus="true"
          :placeholder="`Search ${stats.totalIndexed} links...`"
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
          class="w-full px-10 mx-auto mb-10 text-xs italic text-center text-gray-800 md:w-192 md:text-sm dark:text-gray-600"
        >
          Links are automatically aggregated from all over the Internet. Illegal Content might be linked, but is in no way promoted or endorsed. If you have a problem with a link, please contact the owner of the hosting website which the link points to.
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
                stroke-width="1.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>{{item.title}}</a>
              
              <svg
                v-if="index != poweredBy.length-1"
                class="hidden w-4 h-4 mx-1 md:inline-block"
                viewBox="0 0 24 24"
                stroke-width="1.5"
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

export default {
  name: `Home`,
  components: {
    SearchField,
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
      ]
    };
  },
  computed: {
    stats: function() {
      return this.$store.getters.stats;
    },
    isIndexing: function() {
      return this.stats.isIndexing;
    },
  },
  methods: {

  },
  mounted() {

    this.$store.dispatch(`analytics/trackView`, `/`);

  },
}
</script>
