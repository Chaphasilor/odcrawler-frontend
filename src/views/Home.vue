<template>
  <div
    class="w-full h-full px-6"
  >

    <vue-headful
      title="ODCrawler"
    />

    <nav
      class="absolute top-0 right-0 p-6 text-lg"
    >
      <router-link
        class="hover:font-bold"
        :to="{
          name: `Download`,
        }"
      >
        Get All Links
      </router-link>
    </nav>

    <div
      class="w-full h-full flex flex-col"
    >

      <div
        class="w-full md:h-full flex-shrink-0 flex-col justify-center flex"
      >

        <div
          class="w-full mt-10 text-center flex-shrink-0"
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
          
          <iframe
            class="m-auto mt-4 w-40 h-10"
            src="https://github.com/sponsors/MCOfficer/button"
            title="Sponsor MCOfficer"
            
          ></iframe>
          
        </div>

        <SearchField
          class="mx-auto mt-10 mb-4 md:my-4 w-full md:w-192 h-12"
          v-model="searchQuery"
          :focus="true"
          :placeholder="`Search ${stats.totalIndexed} links...`"
          @search="$router.push({
            name: `Search`,
            params: {
              query: searchQuery,
            }
          })"
        />

        <p
          class="w-full md:w-192 mx-auto mb-10 px-10 text-center text-xs md:text-sm italic text-gray-800 dark:text-gray-600"
        >
          Links are automatically aggregated from all over the Internet. Illegal Content may be linked, but is in no way promoted or endorsed. If you have a problem with a link, please contact the owner of the hosting website.
        </p>

      </div>

      <div
        class="flex-shrink-0 md:fixed md:bottom-0 md:left-0 w-full p-8 text-center"
      >

        <div
          class="m-auto md:text-lg md:font-bold"
        >
          <div
            class="display-block"
          >
            Powered by:
          </div>

          <div
            class="md:flex flex-row justify-center flex-wrap"
          >

            <div
              v-for="(item, index) of poweredBy"
              :key="index"
            >
              <a
                class="text-blue-600 dark:text-blue-400 underline"
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
                class="hidden md:inline-block mx-1 w-4 h-4"
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
      poweredBy: [
        {
          title: `OpenDirectoryDownloader`,
          url: `https://github.com/KoalaBear84/OpenDirectoryDownloader/`,
        },
        {
          title: `MeiliSearch`,
          url: `https://www.meilisearch.com/`,
        },
        {
          title: `Tabler Icons`,
          url: `https://tablericons.com/`,
          icon: {
            paths: `
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M8 9l3 3l-3 3" />
              <line x1="13" y1="15" x2="16" y2="15" />
              <rect x="4" y="4" width="16" height="16" rx="4" />
            `,
            color: `#318BEF`,
          },
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
