'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Logo } from '@/components/logo'
import { Loader2 } from 'lucide-react'
import { useAuth, useFirestore } from '@/firebase'
import type { Staff } from '@/lib/types/staff'
import { placeholderImages } from '@/lib/placeholder-images'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const firestore = useFirestore()
  const router = useRouter()
  const { toast } = useToast()

  const handleSuccessfulLogin = async (user: User) => {
    // Check if the user is a client user
    const staffDocRef = doc(firestore, 'staffs', user.uid)
    const staffDocSnap = await getDoc(staffDocRef)

    if (staffDocSnap.exists()) {
      const staffData = staffDocSnap.data() as Staff
      if (staffData.perfilId === 'cliente' && staffData.contractId) {
        // Redirect to specific client dashboard
        toast({
          title: 'Login bem-sucedido!',
          description: 'Redirecionando para o painel do seu cliente...',
        })
        router.push(`/dashboard/clients/${staffData.contractId}/info`)
        return
      }
    }

    // Default redirection for admin/staff
    toast({
      title: 'Login bem-sucedido!',
      description: 'Redirecionando para o painel...',
    })
    router.push('/dashboard')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      await handleSuccessfulLogin(userCredential.user)
    } catch (error: any) {
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found'
      ) {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          )
          toast({
            title: 'Conta criada com sucesso!',
            description:
              'Como este é seu primeiro acesso, uma nova conta foi criada para você.',
          })
          await handleSuccessfulLogin(userCredential.user)
        } catch (createError: any) {
          toast({
            variant: 'destructive',
            title: 'Erro ao Criar Conta',
            description: `Não foi possível fazer login ou criar uma conta. Verifique os dados e tente novamente. (Erro: ${createError.code})`,
          })
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro de Login',
          description: error.message,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const heroImage = placeholderImages.find((p) => p.id === '1')

  return (
    <div className='w-full lg:grid lg:min-h-screen lg:grid-cols-2'>
      <div className='flex items-center justify-center py-12'>
        <div className='mx-auto grid w-[350px] gap-6'>
          <div className='grid gap-2 text-center'>
            <div className='flex justify-center mb-4'>
              <Logo />
            </div>
            <h1 className='text-3xl font-bold'>Login</h1>
            <p className='text-balance text-muted-foreground'>
              Entre com seu email para acessar o painel
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Senha</Label>
                  <Link
                    href='#'
                    className='ml-auto inline-block text-sm underline'
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className='hidden bg-muted lg:block'>
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            width='1920'
            height='1080'
            className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
          />
        )}
      </div>
    </div>
  )
}
