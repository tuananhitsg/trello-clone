import Link from 'next/link'
import localFont from 'next/font/local'
import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const headingFont = localFont({ src: '../../public/fonts/font.woff2' })
const textFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})
const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div
        className={cn(
          'flex items-center justify-center flex-col',
          headingFont.className
        )}
      >
        <h1 className="text-3xl md:text-6xl text-center text-white mb-6">
          Hello brings all your
        </h1>
        <div
          className="text-3xl md:text-6xl px-4 p-2 
        rounded-md pb-4 w-fit"
        >
          tasks, teammates, and tools together
        </div>
      </div>
      <div
        className={cn(
          'text-sm md:text-xl text-white mt-4 max-w-xs md:max-w-2xl text-center mx-auto',
          textFont.className
        )}
      >
        Keep everything in the same place—even if your team isn’t.
      </div>
      <Button className="mt-6" size="lg" asChild>
        <Link href="/sign-up"> Sign up - it’s free!</Link>
      </Button>
    </div>
  )
}
export default MarketingPage
