import { redirect } from 'next/navigation'

export default function RegisterPage() {
  // Redirect to homepage where the OTP gate handles authentication
  redirect('/')
}
