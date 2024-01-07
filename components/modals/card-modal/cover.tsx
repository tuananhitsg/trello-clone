import { FormCover } from '@/components/form/form-cover'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { CardWithList } from '@/type'
import { PanelTop } from 'lucide-react'
import { ImageColorPicker } from 'react-image-color-picker'
interface CoverProps {
  data: CardWithList
  className?: string
  isCoverHeader?: boolean
}

export const Cover = ({ data, className, isCoverHeader }: CoverProps) => {
  const handleColorPick = (color: string) => {
    console.log('Selected color:', color) // Selected color: rgb(101, 42, 65)
  }

  return (
    <div
      className={cn(
        'bg-no-repeat bg-center bg-contain bg-gray-600 ',
        className
      )}
      style={{ backgroundImage: `url(${data?.imageFullUrl})` }}
    >
      {!isCoverHeader ? null : (
        <FormCover data={data} align="start" side="right" sideOffset={30}>
          <Button
            className="absolute bottom-0 right-0 p-2 m-2"
            variant="gray"
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

Cover.Skeleton = function CoverSkeleton() {
  return (
    <div className="flex items-center">
      <Skeleton className="h-[180px] w-full" />
    </div>
  )
}
