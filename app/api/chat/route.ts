import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ response: "Mensagem inválida." }, { status: 400 })
    }

    // Use a variável de ambiente configurada no Vercel
    const API_KEY = process.env.OPENROUTER_API_KEY

    if (!API_KEY) {
      console.error("OPENROUTER_API_KEY não configurada")
      return NextResponse.json(
        { response: "Configuração da API não encontrada. Entre em contato com o administrador." },
        { status: 500 },
      )
    }

    const API_URL = "https://openrouter.ai/api/v1/chat/completions"

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://your-app.vercel.app",
        "X-Title": "AI Assistant Chatbot",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente útil e amigável. Responda de forma clara e concisa em português brasileiro. Seja prestativo e mantenha um tom profissional mas acessível.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro da API OpenRouter:", response.status, errorText)

      if (response.status === 401) {
        return NextResponse.json(
          { response: "Erro de autenticação com a API. Verifique a configuração da chave." },
          { status: 500 },
        )
      }

      if (response.status === 429) {
        return NextResponse.json(
          { response: "Muitas solicitações. Aguarde um momento e tente novamente." },
          { status: 429 },
        )
      }

      throw new Error(`Erro da API: ${response.status}`)
    }

    const result = await response.json()

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      throw new Error("Resposta inválida da API")
    }

    const botReply = result.choices[0].message.content.trim()

    return NextResponse.json({ response: botReply })
  } catch (error) {
    console.error("Erro no chat:", error)
    return NextResponse.json(
      {
        response: "Desculpe, ocorreu um erro interno. Tente novamente em alguns instantes.",
      },
      { status: 500 },
    )
  }
}
