
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreditCard, LogOut, Settings, User } from 'lucide-react'
import { useAuth, useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { doc } from 'firebase/firestore'
import type { Staff } from '@/app/dashboard/(main)/employees/page'
import { Skeleton } from './ui/skeleton'

export function UserNav() {
  const auth = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const firestore = useFirestore()

  const staffDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'staffs', user.uid) : null),
    [firestore, user]
  )
  const { data: staffProfile, isLoading: isStaffLoading } = useDoc<Staff>(staffDocRef)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }
  
  if (isStaffLoading) {
      return <Skeleton className="h-8 w-8 rounded-full" />
  }

  const displayName = staffProfile?.name || user?.displayName || 'Usuário'
  const displayEmail = staffProfile?.email || user?.email || 'email@example.com'
  const displayAvatar = staffProfile?.avatar || user?.photoURL || ''
  const displayFallback =
    staffProfile?.fallback ||
    displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={displayAvatar}
              alt={`@${displayName}`}
            />
            <AvatarFallback>{displayFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{displayName}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className='mr-2 h-4 w-4' />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className='mr-2 h-4 w-4' />
            <span>Faturamento</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className='mr-2 h-4 w-4' />
            <span>Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
