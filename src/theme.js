import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// A custom theme for this app
const theme = extendTheme({
  trello:{
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange
    //   }
    // }
  },
  components: {
    MuiCssBaseline: { // ghi đè màu scroolbar
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: 'white',
            borderRadius: '8px'
          }
        }
      }
    },
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: 'none', //set chữ hoa thường
          borderWidth: '1px',
          '&:hover': { borderWidth: '2px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Name of the slot
        root: {
          // color: theme.palette.primary.main,
          fontSize: '0.875rem',
          // '.MuiOutlinedInput-notchedOutline': {
          //   borderColor:theme.palette.primary.light // màu viền
          // },
          // '&:hover': {
          //   '.MuiOutlinedInput-notchedOutline': {
          //     borderColor:theme.palette.primary.main // hover => di chuột vào
          //   }
          // },
          '& fieldset': { borderWidth: '1px !important' }, // bôi đậm
          '&:hover fieldset': { borderWidth: '2px !important' }, // bôi đậm
          '&.Mui-focused fieldset': { borderWidth: '2px !important' } // bôi đậm
        }
      }
    }
  }
  //other properties
})

export default theme