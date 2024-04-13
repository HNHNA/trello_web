
/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}


// Cách xử lí bug logic thư viện dnd-kit khi Column là rỗng:
// Phía FE sẽ tự tạo ra một cái card đặc biệt: Placeholder card, không liên quan tới BE
// Card đặc biệt này sẽ được ẩn ở giao diện UI người dùng.
// Cấu trúc Id của card này để unique rất đơn giản, khồng cần phải random phức tạp:
// "columnId-placeholder-card" ( mỗi column chỉ có thể tối đa một các Placeholder Card )
// Quan trọng khi tạo: phải đầy: ( _id, boardId, columnOd, FE_PlaceholderCard )
export const generatePlaceholderCard = (column) => {
  return {
    _id: '${column._id}-placeholder-card',
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

