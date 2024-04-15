import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoradDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect( () => {
    // Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao dùng react-router-dom để lấy chuẩn boardId từ URL về
    const boardId = '661cff7f3cde024e0510cb7a'
    // Call API
    fetchBoradDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board ={board} />
      <BoardContent board ={board}/>
    </Container>
  )
}

export default Board
