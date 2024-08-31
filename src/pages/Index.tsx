import Hero from "@/components/layout/Hero";
import GamesList from "@/components/games/GamesList";
import Container from "@/components/layout/Container";

export default function IndexPage() {
  return (
    <>
      <Hero />
      <Container>
        <GamesList />
      </Container>
    </>
  );
}
