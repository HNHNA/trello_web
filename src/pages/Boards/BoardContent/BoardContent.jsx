import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'


function BoardContent({ board } ) {

  //https://docs.dndkit.com/api-documentation/sensors#usesensor
  // yêu cầu con chuột move 10px thì mới kích hoạt event, fix bug click vào columns thì gọi event không cần thiết
  // Default set by dnd-ket nhưng còn bug  :const poitersSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // yêu cầu con chuột move 10px thì mới kích hoạt event, fix bug click vào columns thì gọi event không cần thiết
  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Ưu tiên sử dụng 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất ko bug
  const sensors = useSensors(mouseSensor, touchSensor)

  //Sắp xếp Columns và kéo thả dnd-kit
  const [orderedColumns, setOerderedColumns] = useState([])

  useEffect(() => {
    //const orderedColumns = mapOrder(board?.columns, board.columnOrderIds, '_id')
    setOerderedColumns(mapOrder(board?.columns, board.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd:', event)
    const { active, over } = event

    // Kiểm tra nếu khồn tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return

    // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // Lấy vị trí cũ (từ thằng active)
      const oldIndex = orderedColumns.findIndex ( c => c._id === active.id)
      // Lấy vị trí mới (từ thằng over)
      const newIndex = orderedColumns.findIndex ( c => c._id === over.id)

      //Dùng arayMove của dnd-kit để sắp xếp lại Column ban đầu
      // Code arayMove: https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      //2 console.log này để sau dùng để xử lý gọi API
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      //console.log('dndOrderedColumns:', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds:', dndOrderedColumnsIds)

      //Cập nhật lại state column ban đầu sau khi đã kéo thả
      setOerderedColumns(dndOrderedColumns)
    }

  }


  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      {/* Box Column */}
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumn columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
