import { SimplifiedLeadPage } from '@/components/SimplifiedLeadPage';
import { UserCheck } from 'lucide-react';

export default function ChatFidaPage() {
  return (
    <SimplifiedLeadPage 
      source="chat_fida"
      redirectSource="fida"
      title="Konsultasi dengan Admin"
      subtitle="Silakan isi data Anda untuk terhubung langsung dengan tim Admin via WhatsApp."
      buttonText="Chat Admin Sekarang"
      badgeText="Personal Representative"
      badgeIcon={<UserCheck className="w-4 h-4" />}
    />
  );
}
