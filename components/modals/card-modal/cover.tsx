import { FormCover } from '@/components/form/form-cover'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { CardWithList } from '@/type'
import { PanelTop } from 'lucide-react'
import { useEffect } from 'react'

interface CoverProps {
  data: CardWithList
  className?: string
  isCoverHeader?: boolean
}

export const Cover = ({ data, className, isCoverHeader }: CoverProps) => {
  return (
    <div
      className={cn(
        'relative bg-no-repeat bg-center bg-contain bg-black/20 ',
        className
      )}
      style={{ backgroundImage: `url(${data?.imageThumbUrl})` }}
    >
      {!isCoverHeader ? null : (
        <FormCover data={data} align="start" side="right" sideOffset={30}>
          <Button
            className="absolute bottom-0 right-0 p-2 m-2 "
            variant="transparent"
            size="inline"
          >
            <PanelTop className="h-4 w-4 mr-2" />
            Cover
          </Button>
        </FormCover>
      )}
    </div>
  )
}
