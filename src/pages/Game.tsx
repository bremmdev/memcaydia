import useScrollToTop from '@/hooks/useScrollToTop'
import { useParams } from 'react-router-dom'

export default function Game() {

  const { slug } = useParams()

  useScrollToTop()

  return (
    <div>{slug}</div>
  )
}
