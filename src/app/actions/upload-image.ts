"use server"

import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"

/**
 * Gera um ID único para nomes de arquivos
 * Esta é uma alternativa caso o UUID não esteja disponível
 */
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * Faz o upload de uma imagem para o diretório public/imagens/incidente
 * @param formData FormData contendo o arquivo de imagem
 * @returns O caminho para a imagem salva
 */
export async function uploadImage(formData: FormData): Promise<string | null> {
  try {
    const file = formData.get("image") as File

    if (!file || file.size === 0) {
      return null
    }

    // Cria um diretoria caso não exista
    const dirPath = join(process.cwd(), "public", "imagens", "incidente")
    try {
      await mkdir(dirPath, { recursive: true })
    } catch (err) {
      console.log("Directory already exists or cannot be created")
    }

    // Gera um nome de arquivo único para evitar sobrescrita
    const fileExtension = file.name.split(".").pop()

    // Tenta usar uuid se estiver disponível, caso contrário usa nossa função alternativa
    let uniqueId
    try {
      // Importação dinâmica para evitar erros de build se o uuid não estiver instalado
      const { v4: uuidv4 } = await import("uuid")
      uniqueId = uuidv4()
    } catch (error) {
      // Recurso alternativo para nosso gerador simples de ID único
      uniqueId = generateUniqueId()
    }

    const fileName = `${uniqueId}.${fileExtension}`
    const filePath = join(dirPath, fileName)

    // Converte o arquivo para um Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Escreve o arquivo no diretório public/imagens/incidente
    await writeFile(filePath, buffer)

    // Retorna o caminho relativo ao diretório public
    return `/imagens/incidente/${fileName}`
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}
