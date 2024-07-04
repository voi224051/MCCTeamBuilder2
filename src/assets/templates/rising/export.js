import Red from './Red.png'
import Orange from './Orange.png'
import Yellow from './Yellow.png'
import Lime from './Lime.png'
import Green from './Green.png'
import Aqua from './Aqua.png'
import Cyan from './Cyan.png'
import Blue from './Blue.png'
import Purple from './Purple.png'
import Pink from './Pink.png'

const images = { Red, Orange, Yellow, Lime, Green, Aqua, Cyan, Blue, Purple, Pink };

function getImageByKey(key) {
  return images[key]
}

export default getImageByKey