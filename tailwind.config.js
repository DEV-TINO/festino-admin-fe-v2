/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,vue}'],
  theme: {
    extend: {
      textColor: {
        primary: {
          900: {
            DEFAULT: '#0073F0',
            dark: '#0052CC',
            light: 'rgba(0, 115, 240, 0.86)',
          },
        },
        secondary: {
          900: {
            DEFAULT: '#999999',
          },
          700: {
            DEFAULT: '#222222',
            light: '#444444',
          },
          300: {
            DEFAULT: 'rgba(255, 255, 255, 0.7)',
          },
        },
        danger: {
          DEFAULT: '#F00E00',
          light: 'rgba(240, 12, 0, 0.12)',
        },
        success: {
          DEFAULT: '#66CF55',
        },
      },
      backgroundColor: {
        primary: {
          900: {
            DEFAULT: '#0073F0',
            dark: '#0052CC',
            light: 'rgba(0, 115, 240, 0.86)',
          },
          800: {
            DEFAULT: 'rgba(0, 115, 240, 0.12)',
            light: '#E6F0FB',
          },
          700: {
            DEFAULT: 'rgba(0, 115, 240, 0.08)',
            light: 'rgba(0, 155, 250, 0.05)',
          },
        },
        secondary: {
          900: {
            DEFAULT: '#999990',
          },
          700: {
            DEFAULT: '#7E8A97',
          },
          300: {
            DEFAULT: '#EEEEEE',
          },
        },
        danger: {
          DEFAULT: '#F00E00',
          light: 'rgba(240, 12, 0, 0.12)',
          dark: '#BC0B00',
        },
      },
      borderColor: {
        primary: {
          900: {
            DEFAULT: '#0073F0',
            dark: '#0052CC',
            light: 'rgba(0, 115, 240, 0.86)',
          },
          700: {
            light: 'rgba(0, 115, 240, 0.12)',
            DEFAULT: 'rgba(0, 115, 240, 0.16)',
          },
        },
        secondary: {
          500: {
            DEFAULT: 'rgba(204, 204,204, 0.28)',
          },
        },
        danger: {
          DEFAULT: '#F00E00',
          light: 'rgba(240, 12, 0, 0.12)',
        },
      },
      fontSize: {
        '3xl': '1.75rem',
      },
      fontFamily: {
        pretendard: ['Pretendard Variable'],
        jalnan2: ['jalnan2'],
      },
      boxShadow: {
        primary: '0 1px 0 0 #0073F0',
      },
      screens: {
        xs: '430px',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
  important: true,
};
