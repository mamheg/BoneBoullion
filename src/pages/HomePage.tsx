import { Hero } from '@/components/home/Hero'
import { BenefitsBar } from '@/components/home/BenefitsBar'
import { PopularSection } from '@/components/home/PopularSection'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export function HomePage() {
  return (
    <>
      <Hero />
      <BenefitsBar />
      <PopularSection />
      <NewsletterSection />
    </>
  )
}
