const theme = {
  orange: {
    DEFAULT: '#FFA500',
    100: '#FFF4CC',
    200: '#FFE699',
    300: '#ffd466',
    400: '#ffb81f',
    500: '#FFA500',
    600: '#DB8500',
    700: '#B76900',
    800: '#934F00',
    900: '#7A3D00'
  },
  red: {
    DEFAULT: '#ee4956',
    100: '#ecd2d4',
    200: '#f4b6bb',
    300: '#ec7f87',
    400: '#f0616d',
    500: '#ee4956',
    600: '#db3140',
    700: '#cc2433',
    800: '#b91221',
    900: '#93000d'
  },
  blue: {
    DEFAULT: '#20afd2',
    100: '#a8eeff',
    200: '#72dff9',
    300: '#55d2f0',
    400: '#36c1e3',
    500: '#20afd2',
    600: '#16a0c1',
    700: '#0d8caa',
    800: '#067893',
    900: '#05596c'
  },
  yellow: {
    500: '#FACC15',
    DEFAULT: '#FACC15'
  },
  green: {
    500: '#76BE36',
    DEFAULT: '#76BE36'
  },
  purple: {
    500: '#8127DB',
    DEFAULT: '#8127DB'
  },
  black: { DEFAULT: '#000', 500: '#000' },
  white: { DEFAULT: '#fff', 500: '#fff' },
  gray: {
    DEFAULT: '#71717a',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b'
  },
  lightgray: { DEFAULT: '#d4d4d8', 500: '#d4d4d8' }
};

const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'bg-orange-500',
    'border-red-500',
    'text-orange',
    'text-red',
    'text-yellow',
    'text-green',
    'text-blue',
    'text-purple',
    'text-black',
    'text-white',
    'text-gray',
    'text-lightgray',
    'bg-orange-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-black-500',
    'bg-white-500',
    'bg-gray-500',
    'bg-lightgray-500'
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: theme.black,
      white: theme.white,
      lightgray: theme.lightgray,
      gray: theme.gray,
      orange: theme.orange,
      blue: theme.blue,
      red: theme.red,
      yellow: theme.yellow,
      green: theme.green,
      purple: theme.purple
    },
    extend: {
      width: {
        cell: '64px',
        '3cell': '192px',
        120: '30rem'
      },
      height: {
        cell: '64px',
        '3cell': '192px',
        112: '28rem',
        120: '30rem',
        128: '32rem',
        140: '35rem',
        160: '40rem'
      },
      strokeWidth: {
        0.5: '0.5',
        3: '3'
      }
    },
    stroke: (theme) => ({
      black: theme('colors.black'),
      gray: theme('colors.gray'),
      white: theme('colors.white'),
      current: 'currentColor'
    }),
    fill: () => ({
      none: 'none',
      current: 'currentColor'
    })
  },
  plugins: [require('@tailwindcss/forms')]
};

module.exports = config;
