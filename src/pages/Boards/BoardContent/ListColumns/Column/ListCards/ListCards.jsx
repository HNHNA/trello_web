import Card from './Card/Card'
import Box from '@mui/material/Box'


function ListCards() {
  return (
    //  Box List Card
    <Box sx={{
      p: '0 5px',
      m: '0 5px',
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      overflowX: 'hidden',
      overflowY: 'auto',
      maxHeight: (theme) => `calc(
      ${theme.trello.boardContentHeight} - 
      ${theme.spacing(5)} -
      ${(theme) => theme.trello.columnHeaderHeight} -
      ${(theme) => theme.trello.columnFooterHeight})`,

      '&::-webkit-scrollbar-thumb': { background: '#ced0da' },
      '&::-webkit-scrollbar-thumb:hover': { background: '#bfc2cf' }
    }}>

      <Card/>
      <Card temporaryHideMedia/>
      <Card temporaryHideMedia/>
      <Card temporaryHideMedia/>
      <Card temporaryHideMedia/>
      <Card temporaryHideMedia/>
      <Card temporaryHideMedia/>


    </Box>
  )
}

export default ListCards