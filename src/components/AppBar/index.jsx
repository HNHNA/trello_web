import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { SvgIcon, Typography } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

function AppBar() {
  const [searchValue, setSearchValue]= useState('') // tim hieu const useState

  return (
    <Box>
      <Box sx={{
        //backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
      }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:2, color: 'white' }}>
          <AppsIcon sx={{ color: 'white' }}/>
          <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
            <SvgIcon component={TrelloIcon} inheritViewBox fontSize="small" sx={{ }} />
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight:'bold' }}>Trello</Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>{/* Responsive BreakPoint*/}
            <Workspaces />
            <Recent />
            <Started />
            <Templates />
            <Button
              sx={{
                color: 'white',
                border: 'none',
                '&:hover': { border: 'none' }
              }}
              variant="outlined"
              startIcon={<LibraryAddIcon/>}
            >
              Create
            </Button>
          </Box>

        </Box>

        <Box sx={{ display:'flex', alignItems:'center', gap:2, cursor: 'pointer' }}>
          <TextField
            id="outlined-search"
            label="Search..."
            type="text"
            size="small"
            value = {searchValue}
            onChange = { (e) => setSearchValue(e.target.value) } //
            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <CloseIcon
                  onClick = {() => setSearchValue ('')} //
                  sx={{
                    fontSize: 'small',
                    color: searchValue ? 'white' : 'transparent', //
                    cursor: 'pointer'
                  }}
                />
              )
            }}

            sx={{
              minWidth: '120px',
              maxWidth: '180px',
              '& label': { color: 'white' },
              '& input': { color: 'white' },
              '& label.Mui-focused': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              }
            }}
          />

          <ModeSelect />

          <Tooltip title="Notification">
            <Badge color="secondary" variant="dot"> {/* variant="dot" = hiển thị chấm thông báo trên icon */}
              <NotificationsNoneIcon sx={{ color: 'white' }} />
            </Badge>
          </Tooltip>

          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ color: 'white' }} />
          </Tooltip>

          <Profiles />

        </Box>
      </Box>
    </Box>
  )
}

export default AppBar
