import axios from 'axios'
import { API_ROOT } from '~/utils/constasnts'


// Giải pháp clean code gọn gàng đó là chúng ta sẽ catch lỗi tập trung tại một nơi bằng cách tận dụng một thứ trong axios là Interceptor
//Boards
export const fetchBoradDetailsAPI = async (boardId) => {
  const respone = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

  // Lưu ý kết quả axios trả về qua property là data
  return respone.data
}

//Columns
export const createNewColumnAPI = async (newColumnData) => {
  const respone = await axios.post(`${API_ROOT}/v1/columns/`, newColumnData)
  // Lưu ý kết quả axios trả về qua property là data
  return respone.data
}

//Cards
export const createNewCardAPI = async (newCardData) => {
  const respone = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  // Lưu ý kết quả axios trả về qua property là data
  return respone.data
}