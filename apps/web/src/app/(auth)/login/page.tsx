import { redirect } from 'next/navigation'

export default function LoginPage() {
  // Redirect to homepage where the OTP gate handles authentication
  redirect('/')
}
