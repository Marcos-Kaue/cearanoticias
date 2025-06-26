import { useProtectAdmin } from "@/hooks/use-protect-admin";

export default function AdminRelatorios() {
  useProtectAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Relatórios</h1>
      <p className="text-gray-600">Visualize relatórios e estatísticas do portal. (Funcionalidade em breve!)</p>
    </div>
  )
} 