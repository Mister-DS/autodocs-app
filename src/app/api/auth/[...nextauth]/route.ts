import { handlers } from "@/lib/auth"

console.log("🚀 API ROUTE LOADED")
console.log("Handlers:", { 
  GET: typeof handlers.GET, 
  POST: typeof handlers.POST 
})

export const { GET, POST } = handlers

console.log("✅ API ROUTE READY")