import { Hero } from '@/components/home/Hero'
import { BenefitsBar } from '@/components/home/BenefitsBar'
import { PopularSection } from '@/components/home/PopularSection'
import { TelegramSection } from '@/components/home/TelegramSection'
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
        <TelegramSection />
      </Reveal>
    </>
  )
}
