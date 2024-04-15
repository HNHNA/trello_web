import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSenSors'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE ={
  COLUMN:'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board, createNewColumn, createNewCard } ) {

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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([null])

  // Điểm va chạm cuối cùng xử lí thuật toán phát hiện va chạm
  const lastOverId = useRef(null)


  useEffect(() => {
    //const orderedColumns = mapOrder(board?.columns, board.columnOrderIds, '_id')
    setOerderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm 1 cái Column theo cardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì handleDragOver chúng ta sẽ
    // làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Trigger khi bắt đầu kéo drag một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart:', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu là kéo Card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  // Funcition chung xử lí việc cập nhật lại state trong trường hợp di chuyển Card giữa 2 Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    over,
    active,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOerderedColumns(prevColumns => {
      // Tìm vị trí ( index ) của thằng overCard trong column đích ( nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // logic tính toán cho cái cardIndex mới ( trên hoặc dưới overCard ) lấy chuẩn ra từ code thư viện
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mảng OrderedColumnsState cũ ra một ra một cái mới để xử lý data rồi return cập nhật lại orderedColumns mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // nextActiveColumn: Column cũ
      if (nextActiveColumn) {
        // Xóa card ở cái column active ( column cũ, lúc kéo card ra khỏi cái cũ để sang column khác )
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Thêm Placeholder Card nếu column rỗng: Bị kéo hết Card đi không còn cái nào
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // Column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, nếu có thìu cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextActiveColumn._id
        }

        // Thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xóa cái Placeholder Card đi nếu nó tồn tại 37.2video
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      // Trả về giá trị state mới chuẩn vị trí card
      return nextColumns
    })
  }
  // Trigger trong quá trình kéo drag 1 phần tử
  const handleDragOver = (event) => {
    // Không làm gì thêm nếu kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Còn nếu kéo Card thì xử lí thêm để có thể kéo card qua lại giữa các Columns
    // console.log('handleDragOver:', event)

    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoặc over ( khi kéo ra khỏi phạm vi container ) thì không làm gì tránh crash trang
    if (!active || !over) return

    // activeDraggingCard: là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với cái card đang được kéo
    const { id: overCardId } = over

    // Tìm 2 cái Columns theo CardID bằng function(findColumnByCardId)
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // console.log('activeColumn:', activeColumn)
    // console.log('overColumn:', overColumn)

    // console.log('activeDraggingCardId:', activeDraggingCardId)
    // console.log('overColumn:', overColumn)

    // Nếu không tồn tại 1 trong 2 column thì return tránh crash trang web
    if ( !activeColumn || !overColumn) return

    // Xử lí logic ở đây khi kéo qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo ( handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề khác ở ( handleDragEnd )
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        over,
        active,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }

  }

  // Trigger khi kết thúc hành động kéo drag một phần tử => hành động thả
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd:', event)
    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoặc over ( khi kéo ra khỏi phạm vi container ) thì không làm gì tránh crash trang
    if (!active || !over) return

    // Xử lí kéo thả Card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: là cái card đang tương tác trên hoặc dưới so với cái card đang được kéo
      const { id: overCardId } = over

      // Tìm 2 cái Columns theo CardID bằng function(findColumnByCardId)
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // console.log('activeColumn:', activeColumn)
      // console.log('overColumn:', overColumn)

      // console.log('activeDraggingCardId:', activeDraggingCardId)
      // console.log('overColumn:', overColumn)

      // Nếu không tồn tại 1 trong 2 column thì return tránh crash trang web
      if ( !activeColumn || !overColumn) return

      // console.log('oldColumnWhenDraggingCard', oldColumnWhenDraggingCard)
      // console.log('overColumn', overColumn)
      // Hành động kéo thả card giữa 2 column khác nhau
      // Phải dùng oldColumnWhenDraggingCard ( có thể dung activeDragItemData ) ( set vào state từ bước handleStart ) chứ không phải activeData trong scope handleDragEnd vì sau khi đi qua onDragOver tới đây là state của Card đã bị cập nhật
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // Hành động kéo thả Card giữa 2 Column khác nhau
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          over,
          active,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả Card trong cùng một Column

        // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex ( c => c._id === activeDragItemId)
        // Lấy vị trí mới (từ thằng overColumn)
        const newCardIndex = overColumn?.cards?.findIndex ( c => c._id === overCardId)

        // Dùng arayMove vì kéo card trong một cái column thì tương tự kéo với logic kéo column trong một boardContent
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        // console.log('dndOrderedCards', dndOrderedCards)


        setOerderedColumns(prevColumns => {
          // Clone mảng OrderedColumnsState cũ ra một ra một cái mới để xử lý data rồi return cập nhật lại orderedColumns mới
          const nextColumns = cloneDeep(prevColumns)

          // Tìm tới cái Column mà chúng ta đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          return nextColumns
        })


      }
    }

    // Xử lí kéo thả Column trong một cái boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
    // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ (từ thằng active)
        const oldColumnIndex = orderedColumns.findIndex ( c => c._id === active.id)
        // Lấy vị trí mới (từ thằng over)
        const newColumnIndex = orderedColumns.findIndex ( c => c._id === over.id)

        //Dùng arayMove của dnd-kit để sắp xếp lại Column ban đầu
        // Code arayMove: https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        //2 console.log này để sau dùng để xử lý gọi API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        //console.log('dndOrderedColumns:', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds:', dndOrderedColumnsIds)

        //Cập nhật lại state column ban đầu sau khi đã kéo thả
        setOerderedColumns(dndOrderedColumns)
      }
    }
    // Những dự liệu sau khi kéo thả phải đưa vừa null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  // console.log('activeDragItemId:', activeDragItemId)
  // console.log('activeDragItemType:', activeDragItemType)
  // console.log('activeDragItemData:', activeDragItemData)

  const customdropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } } })
  }

  // Chúng ta sẽ custom lại chiến lược / thuật toán phát hiện va chạm tối ưu việc kéo thả card giữ nhiều column
  // args = argument = các đối số tham số
  const collectionDetectionStragery = useCallback((args) => {
    // Trường hợp kéo column thì dùm closesCorner là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm các điêm giao nhau, va chạm sẽ trả về một mảng các va chạm ở đây - intersections với con trỏ
    const poiterIntersections = pointerWithin(args)

    // Nếu poiterIntersections là mảng rỗng thì return luôn khồn làm gì hết
    // Fix triệt để bug flickering của thư viện dnd-kit trong trường hợp:
    // Kéo một cái card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
    if (!poiterIntersections?.length) return

    // Thuật toán phát hiện va chạm trả về một mảng các va chạm ở đây
    // const intersections = !!poiterIntersections?.length
    //   ? poiterIntersections
    //   : rectIntersection(args)

    // Tìm overId đầu tiên trong đám poiterIntersections ở trên
    let overId = getFirstCollision(poiterIntersections, 'id')

    if (overId) {
      // Nếu cái over là column thì ta sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm
      // closetCenter hoặc closetCorners đều được. Tuy nhiên ở đây dùng closestCorners mượt hơn
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      // Cảm biến
      sensors={sensors}
      // Thuật toán phát hiện va chạm ( nếu không có thì card với cover lớn sẽ không kéo qua column khác được vì lúc này nó đang bị conflic giữa card và column, chúng ta sẽ dùng closetsCorners thay vì ClosesCenter )
      // collisionDetection={closestCorners}
      collisionDetection={collectionDetectionStragery}

      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>

      {/* Box Column */}
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumn
          columns={orderedColumns}
          createNewColumn = {createNewColumn}
          createNewCard ={createNewCard}
        />
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
