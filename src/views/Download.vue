<template>
  <div
    class="px-6 pb-64"
  >

    <vue-headful
      title="Download Dump"
    />

    <nav
      class="absolute top-0 left-0 p-6 text-lg"
    >
      <router-link
        class="hover:font-bold"
        :to="{
          name: `Home`,
        }"
      >
        Back
      </router-link>
    </nav>

    <div
      class="w-full mt-10 text-center"
    >

      <svg
        class="w-20 h-20 m-auto dark:text-gray-200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <title>ODCrawler</title>

        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <circle cx="12" cy="12" r="3" />
      </svg>

      <router-link
        :to="{
          name: `Home`,
        }"
      >
        <h3
          class="inline-block text-3xl font-semibold cursor-pointer"
        >
          ODCrawler
        </h3>
      </router-link>
      
    </div>

    <div
      class="w-full md:w-4/5 xl:w-1/2 mx-auto"
    >

       <h1
        class="text-3xl font-semibold text-center mt-16 mb-10"
      >
        Download a Database Dump
      </h1>

      <h2
        class="text-xl text-center mb-10"
      >
        Want more control over search results?
        <br>
        Download a file containing all {{ dumpInfo.numberOfLinks !== 0 ? dumpInfo.numberOfLinks : `` }} links and search them yourself!
      </h2>

      <p>
        Our search isn’t perfect, we know that. We are doing what we can to improve it, but if you really want to get your hands dirty, you can download a database dump containing all links and search them using RegEx, etc.<br>
        (You can also check out our GitHub repositories here and here, if you’d like to contribute)
      </p>
      <p
        class="mt-4"
      >
        To download, just click on the button below 👇🏻
      </p>

      <button
        class="mx-auto mt-8 block p-4 text-lg font-semibold text-blue-600 dark:text-blue-400 border-3 border-blue-600 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 rounded-lg transition-colors duration-100"
        type="button"
      >
        Download Dump (.zip, {{ dumpInfo.size }})
      </button>

      <h2
        class="text-xl text-left mt-24 mb-10"
      >
        Tools for Searching the Dump:
      </h2>

      <ol
        class="list-decimal list-inside text-base"
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
              class="w-11/12 my-2 mx-auto dark:bg-gray-400"
              src="@/assets/media/ripgrep1-removebg-preview.png"
              alt="RipGrep sample output"
            >

            Download it from
            <a
              class="text-blue-600 dark:text-blue-400 hover:underline"
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
              class="w-2/3 my-2 mx-auto"
              src="http://docfetcher.sourceforge.net/all/xp_all.png"
              alt="DocFetcher Screenshot"
            >
            
            Download it from
            <a
              class="text-blue-600 dark:text-blue-400 hover:underline"
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
              class="w-2/3 my-2 mx-auto"
              src="http://astrogrep.sourceforge.net/pics/ss_main_new.png"
              alt="RipGrep sample output"
            >
            
            Download it from
            <a
              class="text-blue-600 dark:text-blue-400 hover:underline"
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

export default {
  name: `Download`,
  components: {
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

  },
  mounted() {

    this.$store.dispatch(`analytics/trackView`, `/download`);

  },
}
</script>
