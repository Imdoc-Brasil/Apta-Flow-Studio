'use client'

import { useState } from 'react'
import { useAuth } from '@/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Logo } from '@/components/logo'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: 'Login bem-sucedido!',
        description: 'Redirecionando para o painel...',
      })
      router.push('/dashboard')
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        // This error can mean user not found or wrong password.
        // We'll attempt to create a new user as a fallback.
        try {
          await createUserWithEmailAndPassword(auth, email, password)
          toast({
            title: 'Conta criada com sucesso!',
            description:
              'Como este é seu primeiro acesso, uma nova conta foi criada para você.',
          })
          router.push('/dashboard')
        } catch (createError: any) {
          toast({
            variant: 'destructive',
            title: 'Erro ao Criar Conta',
            description: `Não foi possível fazer login ou criar uma conta. Verifique os dados e tente novamente. (Erro: ${createError.code})`,
          })
        }
      } else {
        // Handle other errors (e.g., network issues)
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

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40'>
      <Card className='mx-auto max-w-sm'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <Logo />
          </div>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>
            Entre com seu email para acessar o painel
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}
