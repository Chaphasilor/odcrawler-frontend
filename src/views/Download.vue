<template>
  <div
    class="p-4 pb-64"
  >

    <vue-headful
      title="Download Dump - ODCrawler"
    />

    <div
      class="flex flex-row justify-between w-full h-auto font-semibold"
    >

      <nav
        class="flex flex-col text-lg text-right md:flex-row"
      >
        <router-link
          class="hover:text-green-400"
          :to="{
            name: `Home`,
          }"
        >
          Start Page
        </router-link>
      </nav>

    </div>

    <LogoHeader/>

    <div
      class="w-full mx-auto md:w-4/5 xl:w-1/2"
    >

      <h1
        class="mt-10 mb-4 text-3xl font-semibold text-center"
      >
        Download a Database Dump
      </h1>

      <h2
        class="mb-10 text-xl text-center"
      >
        Want more control over search results?
        <br>
        Download a file containing {{ dumpInfo.numberOfLinks !== 0 ? dumpInfo.numberOfLinks : `` }} links and search them yourself!
      </h2>

      <p class="text-center md:px-12">
        Our search isn’t perfect, we know that. We are doing what we can to improve it, but if you really want to get your hands dirty, you can download a database dump containing all links and search them using RegEx, etc.<br>
        (You can also check out our GitHub repositories <a class="text-blue-600 underline dark:text-blue-400" href="https://github.com/MCOfficer/odcrawler-discovery" target="_blank" rel="noopener noreferrer">here</a> and <a class="text-blue-600 underline dark:text-blue-400" href="https://github.com/Chaphasilor/odcrawler-frontend" target="_blank" rel="noopener noreferrer">here</a>, if you’d like to contribute)
      </p>
      <p
        class="mt-4 text-center"
      >
        To download, just click on the button below 👇🏻
      </p>

      <div
        class="flex flex-row justify-center mt-8 text-lg font-semibold"
        @click="$store.dispatch(`analytics/trackEvent`, `downloadButtonClicked`);"
      >
        <!-- Link is only for semantics, i.e. enabling right-click menu for link handling, etc. -->
        <a
          class="block w-auto h-full p-4 text-blue-600 transition-colors duration-100 border-blue-600 rounded-lg dark:text-blue-400 border-3 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400"
          :href="dumpInfo.url"
          rel="noopener noreferrer"
          target="_blank"
        >
          Download Dump ({{dumpInfo.url.split(`.`).length > 0 ? `.${dumpInfo.url.split(`.`).slice(-1)[0]}` : `.7z`}}, {{ dumpInfo.size }})
        </a>
      </div>

      <div
        class="mx-auto mt-4 text-xs text-center"
      >Generated at {{ dumpInfo.created.toISOString() }}</div>

      <h2
        class="mt-12 mb-10 text-xl text-left md:mt-24"
      >
        Tools for Searching the Dump:
      </h2>

      <ol
        class="text-base list-decimal list-inside"
      >

        <li
          class="mb-8"
        >
          <h3
            class="inline-block text-base"
          >
            RipGrep:
          </h3>
          <p
            class="p-2"
          >
            An ultra-fast command line utility based on grep.

            <img
              class="w-11/12 mx-auto my-2 dark:bg-gray-400"
              src="@/assets/media/ripgrep1-removebg-preview.png"
              alt="RipGrep sample output"
            >

            Download it from
            <a
              class="text-blue-600 underline dark:text-blue-400 hover:underline"
              href="https://github.com/BurntSushi/ripgrep"
              rel="noopener noreferrer"
              target="_blank"
            >GitHub</a>
          </p>
        </li>
        
        <li
          class="mb-8"
        >
          <h3
            class="inline-block text-base"
          >
            DocFetcher:
          </h3>
          <p
            class="p-2"
          >
            A graphical grep utility for all major platforms.

            <img
              class="w-2/3 mx-auto my-2"
              src="https://a.fsdn.com/con/app/proj/docfetcher/screenshots/189585.jpg"
              alt="DocFetcher Screenshot"
            >
            
            Download it from
            <a
              class="text-blue-600 underline dark:text-blue-400 hover:underline"
              href="http://docfetcher.sourceforge.net/en/index.html"
              rel="noopener noreferrer"
              target="_blank"
            >Sourceforge</a>
          </p>
        </li>
        
        <li
          class="mb-8"
        >
          <h3
            class="inline-block text-base"
          >
            AstroGrep:
          </h3>
          <p
            class="p-2"
          >
            A graphical grep utility for Windows only.

            <img
              class="w-2/3 mx-auto my-2"
              src="https://a.fsdn.com/con/app/proj/astrogrep/screenshots/ss_main_new.png"
              alt="AstroGrep Screenshot"
            >
            
            Download it from
            <a
              class="text-blue-600 underline dark:text-blue-400 hover:underline"
              href="http://astrogrep.sourceforge.net/"
              rel="noopener noreferrer"
              target="_blank"
            >Sourceforge</a>
          </p>
        </li>
        
      </ol>

    </div>

  </div>
</template>

<script>

import LogoHeader from '@/components/LogoHeader';

export default {
  name: `Download`,
  components: {
    LogoHeader,
  },
  data: function() {
    return {
    };
  },
  computed: {
    stats: function() {
      return this.$store.getters.stats;
    },
    dumpInfo: function() {
      return this.$store.getters.dumpInfo;
    }
  },
  methods: {
    startDownload() {

      open(this.dumpInfo.url);
      this.$store.dispatch(`analytics/trackEvent`, `downloadButtonClicked`);
      
    }
  },
  mounted() {

    this.$store.dispatch(`analytics/trackView`, `/download`);

  },
}
</script>
