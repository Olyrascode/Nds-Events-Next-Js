// components/AdminRoute.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // On vérifie que l'utilisateur existe et qu'il a la propriété "isAdmin" à true
    if (!currentUser || !currentUser.isAdmin) {
      // Rediriger vers la page de login ou une page "Unauthorized"
      router.push('/login');
    }
  }, [currentUser, router]);

  // Pendant la vérification, ou si l'utilisateur n'est pas admin, on peut afficher un message ou un loader
  if (!currentUser || !currentUser.isAdmin) {
    return <div>Accès non autorisé...</div>;
  }

  return children;
}
