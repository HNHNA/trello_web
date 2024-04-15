import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoradDetailsAPI, createNewCardAPI, createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect( () => {
    // Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao dùng react-router-dom để lấy chuẩn boardId từ URL về
    const boardId = '661cff7f3cde024e0510cb7a'
    // Call API
    fetchBoradDetailsAPI(boardId).then(board => {
      // Cần xử lí vấn đề khi kéo thả vào column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      setBoard(board)
    })
  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // khi tạo column mới thì chưa có card cần xử lí vấn đề kéo thả một column rỗng
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // cập nhật lại state board
    // Phía FE tự làm đúng lại state data board thay vì gọi lại api fetchBoradDetailsAPI
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id) // Đẩy columnid vào cuối mảng columnorderIds
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // cập nhật lại state board
    // Phía FE tự làm đúng lại state data board thay vì gọi lại api fetchBoradDetailsAPI
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId )
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id) // Đẩy columnid vào cuối mảng columnorderIds
    }
    setBoard(newBoard)
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board ={board} />
      <BoardContent
        board ={board}
        createNewColumn = {createNewColumn}
        createNewCard = {createNewCard}
      />
    </Container>
  )
}

export default Board
