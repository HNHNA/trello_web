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

function AppBar() {
  return (
    <Box>
      <Box px={2} sx={{
        //backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:2, color: 'primary.main' }}>
          <AppsIcon sx={{ color: 'primary.main' }}/>
          <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
            <SvgIcon component={TrelloIcon} inheritViewBox fontSize="small" sx={{ }} />
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight:'bold' }}>Trello</Typography>
          </Box>
          <Workspaces />
          <Recent />
          <Started />
          <Templates />

          <Button variant="outlined">Create</Button>
        </Box>

        <Box sx={{ display:'flex', alignItems:'center', gap:2, cursor: 'pointer' }}>
          <TextField id="outlined-search" label="Search..." type="search" size="small" />

          <ModeSelect />

          <Tooltip title="Notification">
            <Badge color="secondary" variant="dot">
              <NotificationsNoneIcon sx={{ color: 'primary.main' }} />
            </Badge>
          </Tooltip>

          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ color: 'primary.main' }} />
          </Tooltip>

          <Profiles />

        </Box>
      </Box>
    </Box>
  )
}

export default AppBar
