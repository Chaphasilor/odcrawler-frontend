module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './public/**/*.html',
      './src/**/*.vue'
    ]
  },
  theme: {
    borderRadius: {
      'lg': '15px',
    },
    extend: {
      colors: {
      },
      backgroundColor: {
      },
      fontFamily: {
      },
      boxShadow: {
      },
      borderRadius: {
        'xl': '25px',
        'parent': 'inherit',
      },
      spacing: {
        'xs': '.125rem',
      },
      width: {
        '1/10': '10%',
        '9/10': '90%',
        '1/8': '12.5%',
        '7/8': '87.5%',
      },
      height: {
      },
    }, 
  },
  variants: {},
  plugins: [],
}
