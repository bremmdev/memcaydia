import { Link } from 'react-router'
import Container from '../layout/Container'
import NotFoundImg from '@/assets/not-found.webp'

export default function NotFound() {
  return (
    <Container>
      <h1 className="text-4xl sm:text-5xl tracking-wide font-bold text-center text-primary-teal my-8">Page not found</h1>
      <img src={NotFoundImg} alt="404" className="w-5/6 max-w-lg mx-auto" />
      <Link to="/" className="text-white flex justify-center gap-2 items-center bg-primary-teal px-4 py-2 w-fit rounded-md font-medium uppercase hover:bg-opacity-90 mx-auto">Home</Link>
    </Container>
  )
}
