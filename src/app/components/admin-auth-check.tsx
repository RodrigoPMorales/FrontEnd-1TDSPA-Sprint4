"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Só executa se o usuario não for um admin
    if (!isLoading && !isAdmin) {
      router.push("/login?error=unauthorized")
    }
  }, [isLoading, isAdmin, router])

  // loading da pagina
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Verificando acesso...</h2>
          <p className="text-gray-500 mt-2">Por favor, aguarde enquanto verificamos suas credenciais.</p>
        </div>
      </div>
    )
  }

  // Se não for admin, não mostra nada e redireciona para login
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Redirecionando...</h2>
          <p className="text-gray-500 mt-2">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    )
  }

  // Se for admin, mostra a pagina
  return <>{children}</>
}

