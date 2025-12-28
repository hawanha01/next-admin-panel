export interface NavigationItem {
  id: string
  label: string
  icon: string
  route: string
  active: boolean
  children?: NavigationItem[]
}
