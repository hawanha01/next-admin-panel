'use client'

import GenericCard from '@/components/generic/GenericCard'
import GenericText from '@/components/generic/GenericText'

interface Props {
  label: string
  value: string | number
  icon: string
  iconBgColor: string
  valueColor?: string
  isCurrency?: boolean
}

export default function StatCard({
  label,
  value,
  icon,
  iconBgColor,
  valueColor = 'text-gray-900',
  isCurrency = false,
}: Props) {
  const valueSize = isCurrency ? '2xl' : '3xl'

  return (
    <GenericCard>
      <div className="flex items-center justify-between">
        <div>
          <GenericText variant="p" size="sm" color="text-gray-600" className="mb-1">
            {label}
          </GenericText>
          <GenericText variant="h2" size={valueSize} weight="bold" color={valueColor}>
            {value}
          </GenericText>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <GenericText variant="span" size="xl">
            {icon}
          </GenericText>
        </div>
      </div>
    </GenericCard>
  )
}
