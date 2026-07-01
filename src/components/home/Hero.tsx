import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:pt-12">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Copy */}
        <motion.div
          className="order-2 lg:order-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={item} className="eyebrow">100% натурально</motion.p>
          <motion.h1
            variants={item}
            className="mt-4 text-4xl leading-[1.08] sm:text-5xl xl:text-6xl"
          >
            Костный бульон
            <br />
            для здоровья
            <br />и энергии каждый день
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-muted sm:text-base"
          >
            Наш бульон сварен из фермерских костей и овощей по традиционному
            рецепту. Без добавок и консервантов.
          </motion.p>

          <motion.div variants={item} className="mt-7">
            <Link to="/catalog">
              <Button size="lg">
                Выбрать бульон
                <ArrowRight className="size-5" />
              </Button>
            </Link>
          </motion.div>

        </motion.div>

        {/* Visual */}
        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative overflow-hidden rounded-card-lg shadow-card ring-1 ring-line/60">
            <img
              src="/images/hero.jpg"
              alt="Костный бульон BONE BOUILLON в стеклянной банке"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
