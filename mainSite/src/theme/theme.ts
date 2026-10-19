import { extendTheme } from '@chakra-ui/react';

// Material Design 3 color system
const colors = {
  primary: {
    '50': '#e8f0fe',
    '100': '#c2d7fe',
    '200': '#99bcfd',
    '300': '#69a0fc',
    '400': '#4285f4', // Google Blue
    '500': '#1b73e8', // Primary
    '600': '#1557b0',
    '700': '#0d3c78',
    '800': '#062e40',
    '900': '#041e28',
  },
  secondary: {
    '50': '#e6f4ea',
    '100': '#ceead6',
    '200': '#a8dab5',
    '300': '#81c995',
    '400': '#34a853', // Google Green
    '500': '#1e8e3e',
    '600': '#188038',
    '700': '#137333',
    '800': '#0d652d',
    '900': '#08571c',
  },
  error: {
    '50': '#fce8e6',
    '100': '#fad2cf',
    '200': '#f6aea7',
    '300': '#f28b82',
    '400': '#ea4335', // Google Red
    '500': '#d93025',
    '600': '#c5221f',
    '700': '#b31412',
    '800': '#a50e0e',
    '900': '#8c0000',
  },
  warning: {
    '50': '#fef7e0',
    '100': '#feefc3',
    '200': '#fde293',
    '300': '#fdd663',
    '400': '#fbbc04', // Google Yellow
    '500': '#f9ab00',
    '600': '#f29900',
    '700': '#ea8600',
    '800': '#e37400',
    '900': '#dc6100',
  },
  neutral: {
    '50': '#f8f9fa',
    '100': '#f1f3f4',
    '200': '#e8eaed',
    '300': '#dadce0',
    '400': '#bdc1c6',
    '500': '#9aa0a6',
    '600': '#80868b',
    '700': '#5f6368',
    '800': '#3c4043',
    '900': '#202124',
  },
};

// Material Design 3 typography system
const typography = {
  fonts: {
    heading: '"Google Sans Display", "Google Sans", system-ui, sans-serif',
    body: '"Google Sans Text", Roboto, system-ui, sans-serif',
    mono: '"Google Sans Mono", "Roboto Mono", monospace',
  },
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Material Design 3 component styles
const components = {
  Button: {
    baseStyle: {
      borderRadius: 'full',
      fontWeight: 'medium',
      _focus: {
        boxShadow: 'none',
      },
    },
    variants: {
      solid: {
        bg: 'primary.500',
        color: 'white',
        _hover: {
          bg: 'primary.600',
          _disabled: {
            bg: 'primary.500',
          },
        },
      },
      outline: {
        borderColor: 'primary.500',
        color: 'primary.500',
        _hover: {
          bg: 'primary.50',
        },
      },
      ghost: {
        color: 'primary.500',
        _hover: {
          bg: 'primary.50',
        },
      },
    },
    defaultProps: {
      variant: 'solid',
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        bg: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      },
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: 'full',
      px: 3,
      py: 1,
      textTransform: 'capitalize',
      fontWeight: 'medium',
    },
  },
  Heading: {
    baseStyle: {
      fontFamily: 'heading',
      fontWeight: 'medium',
      color: 'neutral.900',
    },
  },
  Text: {
    baseStyle: {
      color: 'neutral.700',
    },
  },
  Link: {
    baseStyle: {
      color: 'primary.500',
      _hover: {
        textDecoration: 'none',
        color: 'primary.600',
      },
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderRadius: 'full',
          borderColor: 'neutral.300',
          _hover: {
            borderColor: 'primary.500',
          },
          _focus: {
            borderColor: 'primary.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
          },
        },
      },
    },
  },
};

// Material Design 3 global styles
const styles = {
  global: {
    body: {
      bg: 'neutral.50',
      color: 'neutral.900',
    },
    '*::placeholder': {
      color: 'neutral.500',
    },
    '*, *::before, *::after': {
      borderColor: 'neutral.200',
    },
  },
};

const theme = extendTheme({
  colors,
  ...typography,
  components,
  styles,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme; 