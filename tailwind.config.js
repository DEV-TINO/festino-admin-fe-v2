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
            light: 'rgba(153, 153, 153, 0.7)',
          },
          700: {
            DEFAULT: '#222222',
            light: '#444444',
          },
          500: {
            DEFAULT: '#4B4B4B',
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
        cancel: {
          DEFAULT: '#CCCCCC',
          light: '#888888',
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
          500: {
            DEFAULT: 'rgba(48, 130, 246, 0.05)',
            light: 'rgba(0, 115, 240, 0.03)',
          },
          300: {
            light: 'rgba(0, 0, 0, 0.03)',
          },
          100: {
            DEFAULT: '#E0EEFD',
          },
        },
        secondary: {
          900: {
            DEFAULT: '#999990',
          },
          700: {
            DEFAULT: '#7E8A97',
          },
          500: {
            DEFAULT: '#EBF4FE',
          },
          300: {
            DEFAULT: '#EEEEEE',
          },
          200: { DEFAULT: '#FF5353' },
        },
        danger: {
          DEFAULT: '#F00E00',
          light: 'rgba(240, 12, 0, 0.12)',
          lighter: 'rgba(255, 109, 109, 0.05)',
          dark: '#BC0B00',
          900: {
            light: 'rgba(255, 109, 109, 0.7)',
          },
          700: {
            DEFAULT: '#FBE4E4',
          },
        },
        success: {
          DEFAULT: '#66CF55',
          dark: '#52B043',
          700: {
            DEFAULT: '#E2F5E1',
          },
          500: {
            DEFAULT: 'rgba(102, 207, 85, 0.05)',
          },
        },
        restore: {
          DEFAULT: '#E6F0FB',
        },
        cancel: {
          DEFAULT: '#CCCCCC',
          light: '#888888',
        },
      },
      borderColor: {
        primary: {
          900: {
            DEFAULT: '#0073F0',
            dark: '#0052CC',
            light: 'rgba(0, 115, 240, 0.86)',
            ligther: 'rgba(0, 115, 240, 0.16)',
          },
          700: {
            light: 'rgba(0, 115, 240, 0.12)',
            DEFAULT: 'rgba(0, 115, 240, 0.16)',
            dark: 'rgba(0, 115, 240, 0.24)',
          },
          600: {
            DEFAULT: '#DAE8FA',
          },
          500: {
            DEFAULT: '#C5E0FC',
          },
        },
        secondary: {
          900: {
            DEFAULT: '#999990',
          },
          700: {
            DEFAULT: '#D7D7D7',
          },
          500: {
            DEFAULT: 'rgba(204, 204,204, 0.28)',
          },
          300: {
            DEFAULT: '#F1F1F1',
          },
        },
        danger: {
          DEFAULT: '#F00E00',
          light: 'rgba(240, 12, 0, 0.12)',
        },
        success: {
          DEFAULT: '#66CF55',
          700: {
            DEFAULT: '#E2F5E1',
          },
          500: {
            DEFAULT: 'rgba(102, 207, 85, 0.05)',
          },
        },
        cancel: {
          DEFAULT: '#CCCCCC',
          light: '#888888',
        },
      },
      borderWidth: {
        1: '1px',
      },
      borderRadius: {
        '2lg': '0.625rem', //10px
        '3lg': '1rem', //16px
        '2xl': '1.25rem', //20px
        '5xl': '3.125rem', //50px
      },
      fontSize: {
        '3xl': '1.75rem',
        '2xs': '0.625rem', //10px
      },
      fontFamily: {
        pretendard: ['Pretendard Variable'],
        jalnan2: ['jalnan2'],
      },
      boxShadow: {
        primary: '0 1px 0 0 rgba(0, 115, 240, 0.16)',
        secondary: '0 0 12px rgba(0, 0, 0, 0.04)',
      },
      ringColor: {
        primary: {
          900: '#0073F0',
        },
      },
      screens: {
        xs: '430px',
        '3xl': '1800px',
      },
    },
  },
  plugins: [require('flowbite/plugin'), require('tailwind-scrollbar-hide')],
  important: true,
};
