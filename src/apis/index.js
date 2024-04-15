import axios from 'axios'
import { API_ROOT } from '~/utils/constasnts'


// Giải pháp clean code gọn gàng đó là chúng ta sẽ catch lỗi tập trung tại một nơi bằng cách tận dụng một thứ trong axios là Interceptor
export const fetchBoradDetailsAPI = async (boardId) => {
  const respone = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

  // Lưu ý kết quả axios trả về qua property là data
  return respone.data
}