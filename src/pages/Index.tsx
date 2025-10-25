import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InvoiceData, TemplateType } from '@/types/invoice';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { TemplateSelector } from '@/components/invoice/TemplateSelector';
import { Button } from '@/components/ui/button';
import { Download, FileText, LogOut, Menu, Tv } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import logo from '../assets/facto-white.png';

type Plan = 'monthly' | 'yearly';
type CreateSessionResponse = { url: string } | { error: string };

// ---------- Helper: confirm a Stripe session on your backend ----------
async function confirmStripeSession(sessionId: string) {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`
  );
  if (!res.ok) throw new Error('Confirmation Stripe invalide');
  // expected response: { ok: true, uid?: string, plan?: 'monthly' | 'yearly' }
  return res.json() as Promise<{
    ok: boolean;
    uid?: string;
    plan?: 'monthly' | 'yearly';
  }>;
}

// ---------- Persist user choices across Stripe redirect ----------
const PENDING_TEMPLATE_KEY = 'facto_pending_template';
const PENDING_INVOICE_KEY = 'facto_pending_invoice';

function savePendingState(template: TemplateType, invoice: InvoiceData) {
  sessionStorage.setItem(PENDING_TEMPLATE_KEY, template);
  sessionStorage.setItem(PENDING_INVOICE_KEY, JSON.stringify(invoice));
}

function restorePendingState(
  setTemplateState: (t: TemplateType) => void,
  setInvoiceState: (i: InvoiceData) => void
) {
  const t = sessionStorage.getItem(PENDING_TEMPLATE_KEY) as TemplateType | null;
  if (t) setTemplateState(t);

  const inv = sessionStorage.getItem(PENDING_INVOICE_KEY);
  if (inv) {
    try {
      setInvoiceState(JSON.parse(inv) as InvoiceData);
    } catch {
      // ignore parse errors
    }
  }
}

function clearPendingState() {
  sessionStorage.removeItem(PENDING_TEMPLATE_KEY);
  sessionStorage.removeItem(PENDING_INVOICE_KEY);
}

const Home = () => {
  const navigate = useNavigate();
  const { user, loading, logout: signOut } = useAuth(); // loading matters here

  const [template, setTemplate] = useState<TemplateType>('modern');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyPostalCode: '',
    companyVAT: '',
    companyPhone: '',
    companyEmail: '',
    clientName: '',
    clientAddress: '',
    clientCity: '',
    clientPostalCode: '',
    clientVAT: '',
    invoiceNumber: '',
    companyLogo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    items: [],
    notes: '',
  });

  const previewRef = useRef<HTMLDivElement>(null);

  // Premium key per user
  const premiumKey = useMemo(
    () => (user?.uid ? `facto_premium:${user.uid}` : 'facto_premium:anon'),
    [user?.uid]
  );

  const [isPremium, setIsPremium] = useState<boolean>(false);

  // Read cached premium when key changes
  useEffect(() => {
    setIsPremium(localStorage.getItem(premiumKey) === 'true');
  }, [premiumKey]);

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>('monthly');

  // =========== Stripe return handling with auth-ready guard ===========
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get('checkout'); // 'success' | 'cancelled' | null
    const sessionId = params.get('session_id');

    const cleanupUrl = () => {
      params.delete('checkout');
      params.delete('session_id');
      const newUrl =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : '');
      window.history.replaceState({}, '', newUrl);
    };

    // Auth ready & success flag
    if (!loading && checkout === 'success') {
      localStorage.setItem(premiumKey, 'true');
      setIsPremium(true);
      setShowPayModal(false);

      const pending = sessionStorage.getItem('facto_pending_download');
      if (pending === '1') {
        sessionStorage.removeItem('facto_pending_download');
        // restore choices before auto-download
        restorePendingState(setTemplate, setInvoiceData);
        setTimeout(() => handleDownloadPDF(), 150);
        clearPendingState();
      }
      cleanupUrl();
      toast.success('Abonnement activé — merci !');
      return;
    }

    // Not ready yet but we got a success or a session id → stash
    if (loading && (checkout === 'success' || sessionId)) {
      sessionStorage.setItem('facto_premium_pending', '1');
      if (sessionId) sessionStorage.setItem('facto_premium_session', sessionId);
      return; // wait until loading === false
    }

    // Auth ready & only session id present → verify with backend
    if (!loading && sessionId) {
      (async () => {
        try {
          toast.loading('Validation de votre abonnement…');
          const res = await confirmStripeSession(sessionId);
          toast.dismiss();

          if (!res?.ok) throw new Error('Session Stripe non valide.');

          localStorage.setItem(premiumKey, 'true');
          setIsPremium(true);
          setShowPayModal(false);

          const pending = sessionStorage.getItem('facto_pending_download');
          if (pending === '1') {
            sessionStorage.removeItem('facto_pending_download');
            // restore choices before auto-download
            restorePendingState(setTemplate, setInvoiceData);
            setTimeout(() => handleDownloadPDF(), 150);
            clearPendingState();
          }

          cleanupUrl();
          toast.success('Abonnement activé — merci !');
        } catch (e: unknown) {
          toast.dismiss();
          cleanupUrl();
          toast.error(
            e instanceof Error
              ? e.message
              : 'Impossible de valider la session Stripe'
          );
        }
      })();
    }

    if (!loading && checkout === 'cancelled') {
      setShowPayModal(false);
      sessionStorage.removeItem('facto_pending_download');
      cleanupUrl();
      toast.message('Abonnement annulé');
    }
  }, [loading, premiumKey]);

  // If success was stashed while auth was loading, finalize now
  useEffect(() => {
    if (loading) return;
    const pending = sessionStorage.getItem('facto_premium_pending');
    if (!pending) return;

    sessionStorage.removeItem('facto_premium_pending');
    const sessionId = sessionStorage.getItem('facto_premium_session');

    if (sessionId) {
      // Verify session now that user is known
      (async () => {
        try {
          toast.loading('Validation de votre abonnement…');
          const res = await confirmStripeSession(sessionId);
          toast.dismiss();

          if (!res?.ok) throw new Error('Session Stripe non valide.');
          localStorage.setItem(premiumKey, 'true');
          setIsPremium(true);
          setShowPayModal(false);

          const dl = sessionStorage.getItem('facto_pending_download');
          if (dl === '1') {
            sessionStorage.removeItem('facto_pending_download');
            // restore choices before auto-download
            restorePendingState(setTemplate, setInvoiceData);
            setTimeout(() => handleDownloadPDF(), 150);
            clearPendingState();
          }
        } catch (e: unknown) {
          toast.dismiss();
          toast.error(
            e instanceof Error
              ? e.message
              : 'Impossible de valider la session Stripe'
          );
        } finally {
          sessionStorage.removeItem('facto_premium_session');
        }
      })();
    } else {
      // No sessionId → success flag path
      localStorage.setItem(premiumKey, 'true');
      setIsPremium(true);
      setShowPayModal(false);

      const dl = sessionStorage.getItem('facto_pending_download');
      if (dl === '1') {
        sessionStorage.removeItem('facto_pending_download');
        // restore choices before auto-download
        restorePendingState(setTemplate, setInvoiceData);
        setTimeout(() => handleDownloadPDF(), 150);
        clearPendingState();
      }
    }
  }, [loading, premiumKey]);

  // ------------------------------------------------------------

  const onClickDownload = () => {
    if (isPremium) {
      handleDownloadPDF();
      return;
    }
    if (!user) {
      toast.message('Veuillez vous connecter pour continuer.');
      navigate('/', { replace: true });
      return;
    }

    // Save current template & invoice so we restore them after Stripe
    savePendingState(template, invoiceData);

    sessionStorage.setItem('facto_pending_download', '1');
    setShowPayModal(true);
  };

  const goPremium = async (plan: Plan) => {
    try {
      if (!user) {
        toast.message('Veuillez vous connecter pour continuer.');
        navigate('/', { replace: true });
        return;
      }

      toast.loading('Redirection vers Stripe…');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/create-checkout-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, uid: user.uid, email: user.email }),
        }
      );
      const data: CreateSessionResponse = await res.json();
      toast.dismiss();

      if (!('url' in data)) {
        const errMsg = 'error' in data ? data.error : 'Pas d’URL de session';
        throw new Error(errMsg);
      }
      window.location.href = data.url;
    } catch (e: unknown) {
      toast.dismiss();
      toast.error(
        e instanceof Error ? e.message : 'Échec de la redirection Stripe'
      );
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    try {
      toast.loading('Génération du PDF…');

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm';
      document.body.appendChild(tempContainer);

      const clonedContent = previewRef.current.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedContent);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(clonedContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
      });

      document.body.removeChild(tempContainer);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (imgHeight > pageHeight) imgHeight = pageHeight;

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      );
      pdf.save(`invoice-${invoiceData.invoiceNumber || 'draft'}.pdf`);

      toast.dismiss();
      toast.success('Facture téléchargée avec succès !');
    } catch (error) {
      toast.dismiss();
      toast.error('Échec de la génération du PDF. Réessayez.');
      console.error(error);
    }
  };

  const planLabel =
    selectedPlan === 'monthly' ? 'Mensuel – 7€ / mois' : 'Annuel – 60€ / an';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-100/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent items-center justify-center hidden md:flex">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-green-400 to-blue-500 bg-clip-text text-transparent">
                Facto
              </h1>
              <p className="text-xs text-muted-foreground hidden md:block">
                Générateur de Factures Belges
              </p>
            </div>
            <div className="bg-gray-400 w-10 h-[1.2px] rotate-90 hidden sm:block" />
            <Link to="/conditiongenerale">
              <p className="text-muted-foreground  hover:text-zinc-400 transition-all duration-300 cursor-pointer hidden sm:block text-sm">
                Conditions générales
              </p>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* email */}
            {user && (
              <span
                className="max-w-[150px] sm:max-w-[180px] truncate text-xs text-muted-foreground"
                title={user.email ?? undefined}
              >
                {user.email}
              </span>
            )}

            {/* status badge */}
            {isPremium ? (
              <span className="text-xs rounded-full px-2 py-1 bg-green-100 text-green-700 border border-green-200">
                Abonnement actif
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Premium requis pour télécharger
              </span>
            )}

            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                onClick={onClickDownload}
                size="lg"
                className="gap-2 text-white shadow-md bg-gradient-to-br from-blue-500 via-green-500 to-blue-500"
              >
                <Download className="h-5 w-5" />
                Télécharger le PDF
              </Button>

              {user && (
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={async () => {
                    await signOut();
                    navigate('/', { replace: true });
                  }}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Se déconnecter
                </Button>
              )}
            </div>

            {/* Mobile hamburger */}
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
                    sideOffset={14}
                    className="w-48"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuItem className="justify-center">
                      <Link to="/conditiongenerale">
                        <p className="cursor-pointer text-sm">
                          Conditions générales
                        </p>
                      </Link>
                    </DropdownMenuItem>
                    <hr />
                    <DropdownMenuItem
                      onClick={onClickDownload}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger le PDF
                    </DropdownMenuItem>

                    {user && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={async () => {
                            await signOut();
                            navigate('/', { replace: true });
                          }}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          Se déconnecter
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Form and template selector */}
          <div className="space-y-6">
            <TemplateSelector selected={template} onSelect={setTemplate} />
            <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
          </div>

          {/* Right column - Preview */}
          <div className="lg:sticky lg:top-16 h-fit lg:w-[570px] mt-12">
            <div className="bg-card rounded-lg border shadow-lg p-6">
              <p className="text-md text-white p-1 bg-gradient-to-br from-green-100 via-green-300 to-green-100 mb-5 animate-pulse w-auto text-center rounded-md shadow-md mx-auto">
                <Tv className="w-10 h-10 mx-auto" />
              </p>
              <h3 className="text-lg font-semibold mb-4">Aperçu en direct</h3>
              <div className="overflow-auto max-h-[750px] bg-muted/30 rounded-lg p-4">
                <div
                  className="transform scale-[0.6] origin-top-left"
                  style={{ width: '166.67%' }}
                >
                  <InvoicePreview
                    ref={previewRef}
                    data={invoiceData}
                    template={template}
                  />
                </div>
              </div>
            </div>

            <img
              src={logo}
              alt="logo"
              className="w-40 h-40 rounded-full mx-auto mt-6"
            />
            <p className="mt-20 text-center text-xs font-serif text-muted-foreground">
              &copy; Tous droits réservés - i-create -{' '}
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <Dialog open={showPayModal} onOpenChange={setShowPayModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Passer à Premium</DialogTitle>
            <DialogDescription>
              Activez Premium pour télécharger vos factures en PDF. Choisissez
              un plan :
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant={selectedPlan === 'monthly' ? 'default' : 'outline'}
              onClick={() => setSelectedPlan('monthly')}
              className="h-auto py-4"
            >
              Mensuel
              <br />
              <span className="text-sm opacity-80">7€ / mois</span>
            </Button>
            <Button
              variant={selectedPlan === 'yearly' ? 'default' : 'outline'}
              onClick={() => setSelectedPlan('yearly')}
              className="h-auto py-4"
            >
              Annuel
              <br />
              <span className="text-sm opacity-80">60€ / an</span>
            </Button>
          </div>

          <DialogFooter className="mt-2">
            <Button className="w-full" onClick={() => goPremium(selectedPlan)}>
              Continuer • {planLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
