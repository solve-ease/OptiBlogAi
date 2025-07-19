import EthicalPrinciples from './EthicalPrinciples'
import TeamShowcase from './TeamShowcase'
import AdoptionMap from './AdoptionMap'
import PressKit from './PressKit'

export default function AboutPage() {
  return (
    <main className="flex flex-col gap-16 px-4 md:px-8 py-12 max-w-7xl mx-auto">
      {/* Page Intro (Optional) */}
      <section className="text-center pt-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          About OptiBlog AI
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Learn about our mission, the people behind the project, and how we’re growing.
        </p>
      </section>

      <EthicalPrinciples />

       <TeamShowcase />

      <AdoptionMap />

      <PressKit />

    </main>
  )
}
