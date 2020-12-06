module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './public/**/*.html',
      './src/**/*.vue'
    ]
  },
  experimental: {
    darkModeVariant: true,
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
        'quicksand': ['Quicksand', 'serif', 'system-ui'],
        'quicksand-bold': ['QuicksandBold', 'serif', 'system-ui'],
      },
      boxShadow: {
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        'sm': '5px',
        'md': '15px',
        'lg': '20px',
        'xl': '25px',
        'full': '9999px',
        'parent': 'inherit',
      },
      strokeWidth: {
        '0.5': '0.5',
        '1.5': '1.5',
        '2.5': '2.5',
        '3': '3',
        '3.5': '3.5',
        '4': '4',
      },
      spacing: {
        'xs': '.125rem',
      },
      width: {
        '1/10': '10%',
        '9/10': '90%',
        '1/8': '12.5%',
        '7/8': '87.5%',
        '14': '3.5rem',
        '28': '7rem',
        '96': '24rem',
        '128': '32rem',
        '192': '48rem',
        '256': '64rem',
      },
      height: {
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    }, 
  },
  variants: {
    backgroundColor: ({ after }) => after(['active']),
    strokeWidth: ({ after }) => after(['hover']),
  },
  plugins: [],
}
