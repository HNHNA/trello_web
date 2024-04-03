import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE ={
  COLUMN:'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
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

  //Cùng một thời điểm chỉ có 1 phần tử được kéo column hoặc card
  const [activeDragItemId, setActiveDragItemId] = useState([null])
  const [activeDragItemType, setActiveDragItemType] = useState([null])
  const [activeDragItemData, setActiveDragItemData] = useState([null])


  useEffect(() => {
    //const orderedColumns = mapOrder(board?.columns, board.columnOrderIds, '_id')
    setOerderedColumns(mapOrder(board?.columns, board.columnOrderIds, '_id'))
  }, [board])

  // Trigger khi bắt đầu kéo drag một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart:', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // Trigger khi kết thúc hành động kéo drag một phần tử => hành động thả
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
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  // console.log('activeDragItemId:', activeDragItemId)
  // console.log('activeDragItemType:', activeDragItemType)
  // console.log('activeDragItemData:', activeDragItemData)

  const customdropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } } })
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>

      {/* Box Column */}
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumn columns={orderedColumns} />
        <DragOverlay dropAnimation={customdropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData}/>)}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData}/>)}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
