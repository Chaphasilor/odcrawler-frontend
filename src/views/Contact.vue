<template>
  <div
    class="px-6 pb-64"
  >

    <vue-headful
      title="Contact - ODCrawler"
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
      class="w-full mx-auto md:w-4/5 xl:w-1/2"
    >

       <h1
        class="mt-16 mb-10 text-3xl font-semibold text-center"
      >
        Contact Us
      </h1>

      <h2
        class="mb-10 text-xl text-center"
      >
        Have a question or idea for us?
        <br>
        We would love to hear it!
      </h2>

      <p class="text-center md:px-12 lg:px-24">
        You can also check out our GitHub repositories <a class="text-blue-600 dark:text-blue-400" href="https://github.com/MCOfficer/odcrawler-discovery" target="_blank" rel="noopener noreferrer">here</a> (backend) and <a class="text-blue-600 dark:text-blue-400" href="https://github.com/Chaphasilor/odcrawler-frontend" target="_blank" rel="noopener noreferrer">here</a> (frontend), if you’d like to contribute ♥
        <br>
        Any issues are welcome, but if you don't want to create an issue, you can simply fill out the form below 👇🏻
      </p>

      <form
        class="grid grid-cols-2 row-gap-4 p-6 mx-32 text-center"
        ref="contactForm"
        method="POST"
        data-netlify="true"
        @submit.prevent="submitForm"
      >
        <input type="hidden" name="form-name" value="contact">

        <label for="contact-name">Your Name:</label>  
        <input
          class="px-2 py-1 bg-gray-300 rounded-md dark:bg-gray-700"
          id="contact-name"
          type="text"
          name="name"
          required
        > 

        <label for="contact-email">Your E-Mail:</label>  
        <input
          class="px-2 py-1 bg-gray-300 rounded-md dark:bg-gray-700"
          id="contact-email"
          type="email"
          name="email"
          pattern=".+@.+\..+"
          required
        > 

        <label for="contact-message">Your Message:</label>
        <textarea
          class="h-40 px-2 py-1 bg-gray-300 rounded-md resize-y dark:bg-gray-700"
          id="contact-message"
          name="message"
          required
        ></textarea>

        <div
          class="justify-center col-span-2 mt-8 text-lg font-semibold"
        >
          <input
            class="inline-block h-full p-2 px-12 text-blue-600 transition-colors duration-100 border-blue-600 rounded-lg cursor-pointer dark:text-blue-400 border-3 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:hover:bg-blue-400"
            type="submit"
            value="Submit!"
          >
        </div>

        <div
          class="col-span-2"
          v-html="contactFeedback"
        ></div>
        
      </form>

    </div>

  </div>
</template>

<script>

export default {
  name: `Contact`,
  components: {
  },
  data: function() {
    return {
      contactFeedback: ``,
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
    submitForm() {

      fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': `application/x-www-form-urlencoded`,
        },
        body: new URLSearchParams(new FormData(this.$refs[`contactForm`])).toString(),
      }).then((response) => {

        if (response.ok) {
          
          this.contactFeedback = `Submitted successfully!`;
          this.$store.dispatch(`analytics/trackEvent`, `contacted`);

        } else {

          this.contactFeedback = `Sorry, but an error occured while submitting your request :/<br>Please try again later.`;
          this.$store.dispatch(`analytics/trackEvent`, `contacted-ERROR`);
          
        }

      }).catch((err) => {

        this.contactFeedback = `Sorry, but an error occured while submitting your request :/<br>Please try again later.`;
        console.error(`err:`, err);
        this.$store.dispatch(`analytics/trackEvent`, `contacted-ERROR`);
        
      })
      
      
    }
  },
  mounted() {

    this.$store.dispatch(`analytics/trackView`, `/contact`);

  },
}
</script>
