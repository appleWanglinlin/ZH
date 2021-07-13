import newTab from './newTab/index'
import newPage from './newPage/index'
import auth from './auth/index'

export default {
  install() {
    newTab()
    newPage()
    auth()
  }
}
