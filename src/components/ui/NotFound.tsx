import Container from '../layout/Container'
import NotFoundImg from '@/assets/not-found.webp'

export default function NotFound() {
  return (
    <Container>
      <h1 className="text-4xl sm:text-5xl tracking-wide font-bold text-center text-primary-teal my-8">Page not found</h1>
      <img src={NotFoundImg} alt="404" className="max-w-lg mx-auto" />
    </Container>
  )
}
