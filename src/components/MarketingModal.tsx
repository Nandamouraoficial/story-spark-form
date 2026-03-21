import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MarketingOutput } from '@/lib/marketing-types';
import { Copy, Check, Sparkles, FileText, MessageSquare, Quote, LayoutList, Download } from 'lucide-react';
import { exportMarketingPDF } from '@/lib/export-marketing-pdf';
import { toast } from '@/hooks/use-toast';

interface MarketingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: MarketingOutput | null;
  loading: boolean;
  attribution: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'Copiado!', description: 'Texto copiado para a área de transferência.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="gap-1.5 text-xs text-muted-foreground hover:text-primary shrink-0"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copiado' : 'Copiar'}
    </Button>
  );
}

function SectionBlock({ title, content, icon }: { title: string; content: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          {title}
        </div>
        <CopyButton text={content} />
      </div>
      <div className="rounded-xl border border-border/50 bg-background/60 p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
        {content}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-1">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function MarketingModal({ open, onOpenChange, data, loading, attribution }: MarketingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto glass-card border-border/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Conteúdo de Marketing
          </DialogTitle>
          {attribution && (
            <p className="text-sm text-muted-foreground">{attribution}</p>
          )}
        </DialogHeader>

        {loading ? (
          <LoadingSkeleton />
        ) : data ? (
          <Tabs defaultValue="headline" className="mt-2">
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-5 h-auto gap-1 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="headline" className="text-xs gap-1 rounded-lg data-[state=active]:bg-background">
                <Sparkles className="h-3 w-3" /> Headline
              </TabsTrigger>
              <TabsTrigger value="full" className="text-xs gap-1 rounded-lg data-[state=active]:bg-background">
                <FileText className="h-3 w-3" /> Completo
              </TabsTrigger>
              <TabsTrigger value="short" className="text-xs gap-1 rounded-lg data-[state=active]:bg-background">
                <MessageSquare className="h-3 w-3" /> Curto
              </TabsTrigger>
              <TabsTrigger value="quotes" className="text-xs gap-1 rounded-lg data-[state=active]:bg-background">
                <Quote className="h-3 w-3" /> Quotes
              </TabsTrigger>
              <TabsTrigger value="classification" className="text-xs gap-1 rounded-lg data-[state=active]:bg-background col-span-2 sm:col-span-1">
                <LayoutList className="h-3 w-3" /> Classificação
              </TabsTrigger>
            </TabsList>

            <TabsContent value="headline" className="space-y-4 mt-4">
              <SectionBlock title="Headline de impacto" content={data.headline} icon={<Sparkles className="h-3.5 w-3.5" />} />
              <SectionBlock title="Melhor frase" content={data.bestQuote} icon={<Quote className="h-3.5 w-3.5" />} />
              <SectionBlock title="Título sugerido para landing page" content={data.suggestedPageTitle} icon={<FileText className="h-3.5 w-3.5" />} />
              <SectionBlock title="Atribuição" content={data.formattedAttribution} />
            </TabsContent>

            <TabsContent value="full" className="space-y-4 mt-4">
              <SectionBlock title="Depoimento completo — Página de vendas" content={data.fullTestimonial} icon={<FileText className="h-3.5 w-3.5" />} />
            </TabsContent>

            <TabsContent value="short" className="space-y-4 mt-4">
              <SectionBlock title="Versão curta — Redes sociais" content={data.shortVersion} icon={<MessageSquare className="h-3.5 w-3.5" />} />
            </TabsContent>

            <TabsContent value="quotes" className="space-y-4 mt-4">
              {data.quotes.map((q, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Frase {i + 1}</p>
                    <CopyButton text={q} />
                  </div>
                  <div className="relative rounded-xl border border-primary/20 bg-primary/[0.04] p-4 border-l-[3px] border-l-primary/40">
                    <span className="absolute -top-1 left-2 text-3xl text-primary/20 font-display leading-none select-none">"</span>
                    <p className="font-display italic text-foreground text-sm sm:text-base leading-relaxed pl-3">
                      {q}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="classification" className="space-y-3 mt-4">
              {[
                { label: 'Antes', value: data.classification.before, emoji: '📍' },
                { label: 'Durante', value: data.classification.during, emoji: '🔄' },
                { label: 'Depois', value: data.classification.after, emoji: '✨' },
                { label: 'Resultado', value: data.classification.result, emoji: '🎯' },
                { label: 'Prova Social', value: data.classification.socialProof, emoji: '👥' },
                { label: 'Diferencial', value: data.classification.differentiator, emoji: '💎' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border/50 bg-background/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.emoji}</span>
                      <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    </div>
                    <CopyButton text={item.value} />
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{item.value}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
