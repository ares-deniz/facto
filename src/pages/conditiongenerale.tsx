import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';

// src/pages/Conditiongenerale.tsx
export default function Conditiongenerale() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50/30">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left: Desktop nav */}
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              to="/home"
              className="text-sm hover:text-foreground font-semibold transition-colors duration-300 px-2 rounded-md bg-green-200/50 hover:bg-green-300/70"
            >
              Accueil
            </Link>
          </nav>
          {/* Center: Title + date */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Conditions Générales d’Utilisation
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Dernière mise à jour : 28 octobre 2025
            </p>
          </div>

          {/* Right: Mobile hamburger */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              {/* Render in portal to avoid layout shift */}
              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-10"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <DropdownMenuItem asChild>
                    <Link to="/home">Accueil</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="prose prose-slate max-w-3xl space-y-3 bg-white/70 backdrop-blur p-6 rounded-lg shadow-lg">
          <h2>1. Présentation</h2>
          <p>
            <strong>Facto</strong> est une application de génération de factures
            pour entreprises, indépendants et freelances en Belgique.
          </p>

          <h2>2. Objet</h2>
          <p>
            Les présentes CGU définissent les modalités d’accès, d’utilisation
            et de souscription aux services de Facto. En utilisant
            l’application, vous acceptez ces conditions sans réserve.
          </p>

          <h2>3. Accès et compte</h2>
          <ul>
            <li>Création de compte par e-mail/mot de passe ou via Google.</li>
            <li>L’utilisateur fournit des informations exactes et à jour.</li>
            <li>Le compte est personnel et non transférable.</li>
          </ul>

          <h2>4. Fonctionnalités</h2>
          <ul>
            <li>
              <strong>Gratuit :</strong> création et aperçu des factures.
            </li>
            <li>
              <strong>Premium :</strong> téléchargement PDF illimité, modèles
              avancés.
            </li>
          </ul>

          <h2>5. Abonnement et facturation</h2>
          <ul>
            <li>Mensuel : 7 € / mois — Annuel : 60 € / an.</li>
            <li>
              Paiements gérés par <strong>Stripe</strong> (PCI-DSS).
            </li>
            <li>
              Annulation possible à tout moment via le portail client Stripe.
            </li>
            <li>Pas de remboursement pour une période déjà entamée.</li>
          </ul>

          <h2>6. Données personnelles (RGPD)</h2>
          <p>
            Les données (e-mail, TVA, adresses, etc.) servent à
            l’authentification, aux factures et à la gestion d’abonnement. Elles
            ne sont jamais vendues. Des sous-traitants techniques (Firebase,
            Stripe…) peuvent être utilisés dans le respect du RGPD. Pour exercer
            vos droits (accès/suppression), contactez
            <a
              href="mailto:icreateandbuild@gmail.com"
              className="text-blue-500"
            >
              support@facto.app
            </a>
            .
          </p>

          <h2>7. Sécurité et responsabilité</h2>
          <ul>
            <li>Mesures raisonnables de sécurité mises en œuvre.</li>
            <li>
              L’exactitude des données saisies reste sous la responsabilité de
              l’utilisateur.
            </li>
            <li>
              Aucune responsabilité en cas d’indisponibilité temporaire du
              service.
            </li>
          </ul>

          <h2>8. Propriété intellectuelle</h2>
          <p>
            Le code, les designs, logos et contenus de Facto sont protégés.
            Toute reproduction non autorisée est interdite.
          </p>

          <h2>9. Résiliation</h2>
          <p>
            Facto peut suspendre ou fermer un compte en cas de fraude, abus ou
            non-respect des présentes CGU.
          </p>

          <h2>10. Modifications</h2>
          <p>
            Les CGU peuvent être modifiées à tout moment. La version à jour est
            publiée dans l’application.
          </p>

          <h2>11. Droit applicable</h2>
          <p>
            Droit belge. Compétence exclusive des tribunaux de Bruxelles en cas
            de litige.
          </p>

          <h2>12. Contact</h2>
          <p>
            📧{' '}
            <a
              href="mailto:icreateandbuild@gmail.com"
              className="text-blue-500"
            >
              support@facto.app
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
