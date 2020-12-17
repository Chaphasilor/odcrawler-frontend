<template>
  <div
    class="flex-row w-full h-auto md:flex"
  >

    <div
      class="w-full mb-3 border-b border-black md:flex md:flex-row-reverse md:border-b-0 dark:border-gray-700"
    >

      <div
        class="w-full h-auto px-1 break-all whitespace-pre-wrap"
      >

        <span
          v-for="(sublink, index) of sublinks"
          :key="index"
          class=""
        ><a
            :class="`${(index == sublinks.length-1 && alive === false) ? `line-through text-red-500` : `text-blue-600 dark:text-blue-400 hover:underline`} `"
            :title="(index == sublinks.length-1 && alive === false) ? `This link appears to be dead...` : ``"
            rel="noopener noreferrer"
            target="_blank"
            :href="sublink.link"
          ><text-highlight
            :queries="(highlights.apply !== `filename` || index === sublinks.length-1) ? highlights.strings : []"
            :caseSensitive="false"
            highlightClass="bg-yellow-500 dark:bg-yellow-900"
            highlightComponent="span"
          >{{sublink.name}}</text-highlight></a><span v-if="index != sublinks.length-1" class="text-blue-600 dark:text-blue-400">/</span></span>
      
      </div>

      <div
        class="flex-shrink-0 mr-1 text-center md:w-14 md:text-right"
      >{{ formattedSize }}</div>

    </div>

    <div
      class="flex flex-row justify-evenly"
    >

      <div
        class="flex-col justify-center inline-block w-1/2 text-center border-black md:w-auto md:border-l dark:border-gray-700 md:flex"
      >
        
        <button
          class="h-full px-2 mx-1 font-bold transition-colors duration-75 rounded-full sm:hover:bg-gray-400 sm:dark:hover:bg-gray-700 focus:outline-none"
          @click="copyLinkToClipboard"
        >
          <transition
            mode="out-in"
            name="fade"
            enter-active-class="transition-opacity duration-150"
            enter-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <svg
              v-if="!copied"
              key="0"
              class="w-6 h-6"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Copy to Clipboard</title>
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
            </svg>

            <svg
              v-if="copied"
              key="1"
              class="w-6 h-6"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Copied Successfully</title>
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
              <path d="M9 14l2 2l4 -4" />
            </svg>

            <!-- <span v-if="!copied" key="0">Copy Link</span>
            <span v-if="copied" key="1" class="text-green-500">Copied!</span> -->
          </transition>
        </button>
      </div>

      <div
        v-if="webShare"
        class="flex-col justify-center inline-block w-1/2 text-center border-l border-black md:w-auto dark:border-gray-700 md:flex"
      >
        
        <button
          class="h-full px-2 mx-1 font-bold transition-colors duration-75 rounded-full sm:hover:bg-gray-400 sm:dark:hover:bg-gray-700 focus:outline-none"
          @click="shareLink"
        >
          <svg
            class="w-6 h-6"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Share Link</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="18" cy="18" r="3" />
            <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
            <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
          </svg>

        </button>
      </div>

      <div
        class="flex-col justify-center inline-block w-1/2 text-center border-l border-black md:w-auto dark:border-gray-700 md:flex"
      >
        <button
          class="h-full px-2 mx-1 font-bold transition-colors duration-75 rounded-full sm:hover:bg-gray-400 sm:dark:hover:bg-gray-700 focus:outline-none"
          @click="openNewTab(`https://www.virustotal.com/gui/search/${doubleEncodedUrl}`)"
        >

          <svg
            class="w-6 h-6"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Scan for Viruses</title>
            <path d="M17 12a5 5 0 1 0 -5 5" />
            <path d="M12 7v-4m-1 0h2" />
            <path d="M12 7v-4m-1 0h2" transform="rotate(45 12 12)" />
            <path d="M12 7v-4m-1 0h2" transform="rotate(90 12 12)" />
            <path d="M12 7v-4m-1 0h2" transform="rotate(180 12 12)" />
            <path d="M12 7v-4m-1 0h2" transform="rotate(225 12 12)" />
            <path d="M12 7v-4m-1 0h2" transform="rotate(270 12 12)" />
            <path d="M12 7v-4m-1 0h2" transform="rotate(315 12 12)" />
            <circle cx="17.5" cy="17.5" r="2.5" />
            <line x1="19.5" y1="19.5" x2="22" y2="22" />
          </svg>

        </button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: `LinkRow`,
  props: {
    link: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    highlights: {
      type: Object,
      default: function() {
        return {
          apply: `url`,
          strings: [],
        };
      }
    },
    meta: {
      type: Object,
      default: function() {
        return {};
      }
    },
  },
  data: function() {
    return {
      copied: false,
      alive: undefined,
    }
  },
  computed: {
    sublinks: function() {
      return this.generateSublinks(this.link);
    },
    doubleEncodedUrl: function() {
      return encodeURIComponent(encodeURIComponent(this.link));
    },
    formattedSize: function() {
      return this.size >= 0 ? this.formatBytes(this.size) : this.meta.sizeInBytes >= 0 ? this.formatBytes(this.meta.sizeInBytes) : `N/A`;
    },
    webShare: function() {
      return navigator.share;
    }
  },
  watch: {
    copied: {
      handler: function(newValue) {

        if (newValue) {
          setTimeout(() => {
            this.copied = false;
          }, 1000)
        }

      }
    }
  },
  methods: {
    formatBytes(bytes, decimals = 0) {

      if (bytes === 0) return `0 B`;
    
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = [`B`, `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`];
    
      const i = Math.floor(Math.log(bytes) / Math.log(k));
    
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ` ` + sizes[i];

    },
    generateSublinks(link) {

      let parts = link.split(`/`);
      parts.unshift(parts.splice(0, 3).join(`/`));

      parts = parts.map((part, index, arr) => {
        return {
          name: part,
          link: arr.reduce((sum, curr, innerIndex) => {
            if (innerIndex <= index) {
              return innerIndex == 0 ? curr : `${sum}/${curr}`; 
            } else {
              return sum;
            }
          }, ``),
        }
      })

      return parts;

    },
    copyLinkToClipboard() {

      navigator.clipboard.writeText(encodeURI(this.link));
      this.copied = true;
      
    },
    shareLink() {

      navigator.share({
        title: this.sublinks[this.sublinks.length-1].name,
        url: this.link,
      })
      
    },
    openNewTab(url) {
      window.open(url);
    },
    // async checkLink() {

    //   let schroedingersLink = this.link;
    //   let res;

    //   try {
    //     res = await fetch(`/.netlify/functions/checkLinkAlive`, {
    //       method: `POST`,
    //       body: JSON.stringify({
    //         url: schroedingersLink,
    //       })
    //     })
    //   } catch (err) {

    //     console.warn(`Couldn't check if link is alive:`, err);
    //     return false;

    //   }

    //   if ([502, 504].includes(res.status)) {
    //     return false;
    //   }

    //   let body;
    //   try {
    //     body = await res.json();
    //   } catch (err) {
    //     console.warn(`Couldn't parse JSON from response body!`);
    //     return res.ok;
    //   }

    //   if (body.sizeInBytes > 0) {
    //     //TODO make this persistant by updating the item in the store.
    //     this.size = body.sizeInBytes;
    //   }
    //   return body.isAlive;
      
    // }
  },
  mounted() {

    // this.checkLink().then(alive => this.alive = alive);

    this.generateSublinks(this.link);

    setTimeout(() => {
      this.$emit(`link-mounted`);
    }, 500);

  }
}
</script>
