import { ApiKey } from '@/generated/prisma/client'
import { ApiKeyCreateInput } from '@/generated/prisma/models'
import { proxy } from 'valtio'

const apiKeyState = proxy({
    data: [] as Pick<ApiKey, "id" | "title" | "active" | "expiresAt" | "apikey" | "description" >[],
    form: {} as Pick<ApiKeyCreateInput, "title" | "description" | "expiresAt">,
    loadingLoad: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false
})

async function onLoad() { }
async function onCreate() { }
async function onUpdate() { }
async function onDelate() { }

export {
    apiKeyState,
    onCreate,
    onDelate,
    onLoad,
    onUpdate
}