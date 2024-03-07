import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const Menu_Styles = {
  color: 'primary.main',
  bgcolor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <div>
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2, //padding=px
        overflowX: 'auto',
        borderTop: '1px solid #00bfa5'
      }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          <Chip
            sx={Menu_Styles}
            icon={<DashboardIcon />}
            label="Hanzdev"
            clickable
          />
          <Chip
            sx={Menu_Styles}
            icon={<VpnLockIcon />}
            label="Public/Private Workspaces"
            clickable
          />
          <Chip
            sx={Menu_Styles}
            icon={<AddToDriveIcon />}
            label="Add To Google Drive"
            clickable
          />
          <Chip
            sx={Menu_Styles}
            icon={<BoltIcon />}
            label="Automation"
            clickable
          />
          <Chip
            sx={Menu_Styles}
            icon={<FilterListIcon />}
            label="Filters"
            clickable
          />
        </Box>

        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          <Button variant="outlined" startIcon={<PersonAddIcon/>}>Invite</Button>
          <AvatarGroup
            max={7}
            sx={{
              '& .MuiAvatar-root': {
                width: 34,
                height: 34,
                fontSize: 16
              }
            }}
          >
            <Tooltip title= 'Hanzdev'>
              <Avatar
                alt="Hanzdev"
                src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/423583035_754905863249451_7899093556360386533_n.jpg?stp=cp6_dst-jpg_p320x320&_nc_cat=103&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeG2kLsBx4E7uKVNnlMddy59Z3FK7RCCa3ZncUrtEIJrdrPXt07sXvyonZe-PfVVZNPF5M2MPSsS5_YoeuZ_IDDW&_nc_ohc=wOjbiMMdRuUAX9WZM6V&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfCIU5DzwPJejpZmgkar_XR0dGhaf1YL2XP_y_CV-Jsd-w&oe=65EBD6C5" />
            </Tooltip>
            <Tooltip title= 'Hanzdev'>
              <Avatar
                alt="Hanzdev"
                src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/423583035_754905863249451_7899093556360386533_n.jpg?stp=cp6_dst-jpg_p320x320&_nc_cat=103&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeG2kLsBx4E7uKVNnlMddy59Z3FK7RCCa3ZncUrtEIJrdrPXt07sXvyonZe-PfVVZNPF5M2MPSsS5_YoeuZ_IDDW&_nc_ohc=wOjbiMMdRuUAX9WZM6V&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfCIU5DzwPJejpZmgkar_XR0dGhaf1YL2XP_y_CV-Jsd-w&oe=65EBD6C5" />
            </Tooltip>
            <Tooltip title= 'Hanzdev'>
              <Avatar
                alt="Hanzdev"
                src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/423583035_754905863249451_7899093556360386533_n.jpg?stp=cp6_dst-jpg_p320x320&_nc_cat=103&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeG2kLsBx4E7uKVNnlMddy59Z3FK7RCCa3ZncUrtEIJrdrPXt07sXvyonZe-PfVVZNPF5M2MPSsS5_YoeuZ_IDDW&_nc_ohc=wOjbiMMdRuUAX9WZM6V&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfCIU5DzwPJejpZmgkar_XR0dGhaf1YL2XP_y_CV-Jsd-w&oe=65EBD6C5" />
            </Tooltip>
            <Tooltip title= 'Hanzdev'>
              <Avatar
                alt="Hanzdev"
                src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/423583035_754905863249451_7899093556360386533_n.jpg?stp=cp6_dst-jpg_p320x320&_nc_cat=103&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeG2kLsBx4E7uKVNnlMddy59Z3FK7RCCa3ZncUrtEIJrdrPXt07sXvyonZe-PfVVZNPF5M2MPSsS5_YoeuZ_IDDW&_nc_ohc=wOjbiMMdRuUAX9WZM6V&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfCIU5DzwPJejpZmgkar_XR0dGhaf1YL2XP_y_CV-Jsd-w&oe=65EBD6C5" />
            </Tooltip>
            <Tooltip title= 'Hanzdev'>
              <Avatar
                alt="Hanzdev"
                src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/423583035_754905863249451_7899093556360386533_n.jpg?stp=cp6_dst-jpg_p320x320&_nc_cat=103&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeG2kLsBx4E7uKVNnlMddy59Z3FK7RCCa3ZncUrtEIJrdrPXt07sXvyonZe-PfVVZNPF5M2MPSsS5_YoeuZ_IDDW&_nc_ohc=wOjbiMMdRuUAX9WZM6V&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfCIU5DzwPJejpZmgkar_XR0dGhaf1YL2XP_y_CV-Jsd-w&oe=65EBD6C5" />
            </Tooltip>
            <Tooltip title= 'Hanzdev'>
              <Avatar
                alt="Hanzdev"
                src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/423583035_754905863249451_7899093556360386533_n.jpg?stp=cp6_dst-jpg_p320x320&_nc_cat=103&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeG2kLsBx4E7uKVNnlMddy59Z3FK7RCCa3ZncUrtEIJrdrPXt07sXvyonZe-PfVVZNPF5M2MPSsS5_YoeuZ_IDDW&_nc_ohc=wOjbiMMdRuUAX9WZM6V&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfCIU5DzwPJejpZmgkar_XR0dGhaf1YL2XP_y_CV-Jsd-w&oe=65EBD6C5" />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </div>
  )
}

export default BoardBar

