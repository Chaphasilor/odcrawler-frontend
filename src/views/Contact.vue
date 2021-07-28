<template>
  <div
    class="p-4 pb-64 md:pb-0"
  >

    <vue-headful
      title="Contact - ODCrawler"
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
        Contact Us
      </h1>

      <h2
        class="mb-10 text-xl text-center"
      >
        Have a question or idea for us?
        <br>
        We would love to hear it!
      </h2>

      <p class="text-center md:px-12">
        You can also check out our GitHub repositories <a class="text-blue-600 underline dark:text-blue-400" href="https://github.com/MCOfficer/odcrawler-discovery" target="_blank" rel="noopener noreferrer">here (backend)</a> and <a class="text-blue-600 underline dark:text-blue-400" href="https://github.com/Chaphasilor/odcrawler-frontend" target="_blank" rel="noopener noreferrer">here (frontend)</a>, if you would like to contribute ❤
        <br>
        Any issues are welcome, but if you don't want to create an issue, you can simply fill out the form below 👇🏻
      </p>

      <form
        class="grid grid-cols-2 p-6 text-center gap-y-4"
        ref="contactForm"
        method="POST"
        data-netlify="true"
        @submit.prevent="submitForm"
      >
        <input type="hidden" name="form-name" value="contact">

        <label
          class="px-2"
          for="contact-name"
        >Name:</label>  
        <input
          class="px-2 py-1 bg-gray-300 rounded-md dark:bg-gray-700"
          id="contact-name"
          type="text"
          name="name"
          required
        > 

        <label
          class="px-2"
          for="contact-email"
        >E-Mail:</label>  
        <input
          class="px-2 py-1 bg-gray-300 rounded-md dark:bg-gray-700"
          id="contact-email"
          type="email"
          name="email"
          pattern=".+@.+\..+"
          required
        > 

        <label
          class="px-2"
          for="contact-message"
        >Message:</label>
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
            class="inline-block h-full p-2 px-12 text-blue-600 transition-colors duration-100 bg-transparent border-blue-600 rounded-lg cursor-pointer dark:text-blue-400 border-3 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:hover:bg-blue-400"
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

import LogoHeader from '@/components/LogoHeader';

export default {
  name: `Contact`,
  components: {
    LogoHeader,
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
