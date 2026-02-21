import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendKey = process.env.RESEND_API_KEY
const from = process.env.RESEND_FROM_EMAIL || 'Testa Run <onboarding@resend.dev>'
const to = process.env.RESEND_CONTACT_TO || 'testarun@gmail.com'

export async function POST(req: Request) {
  if (!resendKey) {
    return NextResponse.json({ error: 'Email not configured.' }, { status: 500 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const message = String(body.message || '').trim()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 })
  }

  // Honeypot
  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const resend = new Resend(resendKey)

  try {
    await resend.emails.send({
      from,
      to,
      subject: `[testa.run] Contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to send.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
