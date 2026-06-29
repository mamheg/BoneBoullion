import { Hero } from '@/components/home/Hero'
import { BenefitsBar } from '@/components/home/BenefitsBar'
import { PopularSection } from '@/components/home/PopularSection'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { Reveal } from '@/components/ui/Reveal'

export function HomePage() {
  return (
    <>
      <Hero />
      <Reveal>
        <BenefitsBar />
      </Reveal>
      <Reveal>
        <PopularSection />
      </Reveal>
      <Reveal>
        <NewsletterSection />
      </Reveal>
    </>
  )
}
