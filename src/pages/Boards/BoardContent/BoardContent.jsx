import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumns'


function BoardContent({ board } ) {
  return (
    <div>
      {/* Box Column */}
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumn columns={board?.columns} />
      </Box>
    </div>
  )
}

export default BoardContent
