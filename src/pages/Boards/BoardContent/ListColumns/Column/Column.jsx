import Box from '@mui/material/Box'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'


function Column({ column, createNewCard }) {
  //Drop Drag Columns
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })
  const dndKetColumnStyles = {
    tounchAction: 'none', // fix bug kéo thả trên moblie dành cho sensor dạng default
    // Nếu dùng CSS Transform như document sẽ bị lỗi stretch link: https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    // Chiêu cao phải luôn max 100% vì nếu không sẽ lỗi lúc kéo column ngắn qua một column dài thì phải kéo ở khu vực giữa sỉnh a bug. Lưu ý lúc này phải kết hợp {..listeners} nằm trong Box
    //chứ không phải ở div ngoài cùng để tránh trường hợp kéo vào vùng xanh
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  // dropdown menu
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {setAnchorEl(event.currentTarget)}
  const handleClose = () => {setAnchorEl(null)}

  //Sắp xếp Cards
  const oderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please Enter Card Title', { position: 'bottom-right' })
      return
    }
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    // dùng Redux Global Store có thể gọi trực tiếp API ở đây
    // Gọi lên props function createNewCard nằm ở component cha cao nhất Boards/_id.jsx
    await createNewCard(newCardData)

    // Đóng trạng thái thêm Column mới & Clear Input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  //phải bọc div ở đây vì vấn đề chiều cao của column khi kéo thả sẽ có bug kiểu flickering
  return (
    <div
      //Drop Drag Columns
      ref={setNodeRef} style={dndKetColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{ /* Box Column 01*/
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(
            ${theme.trello.boardContentHeight} - 
            ${theme.spacing(5)})`
        }}>

        {/* Box Column Header*/}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant='h6' sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {column?.title}
          </Typography>

          <Box>
            <Tooltip title="More option">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column_dropdown"
                aria-controls={open ? 'basic-menu-column-droprown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-doprown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column_dropdown'
              }}
            >
              <MenuItem>
                <ListItemIcon> <AddCardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>

              <Divider />
              <MenuItem>
                <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>

            </Menu>
          </Box>
        </Box>

        {/* Box List Card */}
        <ListCards cards={oderedCards} />

        {/* Box Column Footer */}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}>
          { !openNewCardForm
            ? <Box sx={{
              height:'100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon/>} onClick={toggleOpenNewCardForm}>Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor:'pointer' }}/>
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter column title..."
                type="text"
                size="small"
                variant='outlined'
                autoFocus
                data-no-dnd = "true" // fix bug kéo thả khi bôi đen bằng customLib TouchSensor and MouseSensor
                value = {newCardTitle}
                onChange = {(e) => setNewCardTitle(e.target.value)}
                sx={{
                  // minWidth: '100%',
                  // maxWidth: '100%',
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  'MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={ addNewCard }
                  variant = "contained" color = "success" size="small"
                  sx={{
                    boxShadow:'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick = {toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column
