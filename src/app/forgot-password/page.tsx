
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Logo } from '@/components/logo'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/firebase'
import { placeholderImages } from '@/lib/placeholder-images'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Erro de configuração',
        description: 'O serviço de autenticação não está disponível.',
      })
      return
    }
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      toast({
        title: 'Email enviado!',
        description:
          'Se uma conta com este email existir, um link para redefinir a senha foi enviado.',
      })
      router.push('/login')
    } catch (error: any) {
      console.error('Password reset error:', error)
      // We show a generic message to avoid leaking user information
      toast({
        title: 'Email enviado!',
        description:
          'Se uma conta com este email existir, um link para redefinir a senha foi enviado.',
      })
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
            <h1 className='text-3xl font-bold'>Recuperar Senha</h1>
            <p className='text-balance text-muted-foreground'>
              Digite seu email para receber um link de recuperação.
            </p>
          </div>
          <form onSubmit={handlePasswordReset}>
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
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Enviar link de recuperação'
                )}
              </Button>
            </div>
          </form>
          <div className='mt-4 text-center text-sm'>
            <Link href='/login' className='underline flex items-center justify-center'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Voltar para o login
            </Link>
          </div>
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
