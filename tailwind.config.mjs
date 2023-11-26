/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem'
    },
    screens: {
      xs: '431px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      mxs: { max: '431px' },
      msm: { max: '640px' },
      mmd: { max: '768px' },
      mlg: { max: '1024px' },
      mxl: { max: '1280px' },
      m2xl: { max: '1536px' },
      xsm: { min: '431px' },
      smm: { min: '640px' },
      mdm: { min: '768px' },
      lgm: { min: '1024px' },
      xlm: { min: '1280px' },
      '2xlm': { min: '1536px' }
    },
    container: {
      center: true
    },
    extend: {
      minWidth: {
        xs: '431px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      maxWidth: {
        xs: '431px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      spacing: {
        sm: '1rem',
        md: '2rem',
        lg: '4rem',
        xl: '8rem',
        '2xl': '16rem',
        '4xl': '32rem'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: []
}
