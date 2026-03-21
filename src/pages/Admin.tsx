import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Testimonial,
  getTestimonials,
  exportToCSV,
  mentorshipLabels,
  MentorshipType,
  conditionalQuestions,
} from '@/lib/testimonial-data';
import { Download, Star, Lock, MessageSquareQuote, Users, TrendingUp, ThumbsUp, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MarketingOutput } from '@/lib/marketing-types';
import MarketingModal from '@/components/MarketingModal';
import { toast } from '@/hooks/use-toast';

const ADMIN_PASSWORD = 'admin2024';

const mentorshipIcons: Record<MentorshipType, string> = {
  empreendedorismo: '🚀',
  crescimento: '🎯',
  virada: '⚡',
  linkedin: '💼',
};

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [marketingModal, setMarketingModal] = useState(false);
  const [marketingData, setMarketingData] = useState<MarketingOutput | null>(null);
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [marketingAttribution, setMarketingAttribution] = useState('');
  const [marketingCache, setMarketingCache] = useState<Record<string, MarketingOutput>>({});

  useEffect(() => {
    if (authenticated) {
      getTestimonials().then(setTestimonials);
    }
  }, [authenticated]);

  const stats = useMemo(() => {
    if (testimonials.length === 0) return null;
    const avg = testimonials.reduce((s, t) => s + t.satisfactionScore, 0) / testimonials.length;
    const recPct = Math.round((testimonials.filter(t => t.wouldRecommend).length / testimonials.length) * 100);
    return { total: testimonials.length, avg: avg.toFixed(1), recPct };
  }, [testimonials]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleGenerateMarketing = useCallback(async (t: Testimonial) => {
    setMarketingAttribution(`${t.name}, ${t.role} — ${t.company}`);
    setMarketingModal(true);

    if (marketingCache[t.id]) {
      setMarketingData(marketingCache[t.id]);
      return;
    }

    setMarketingLoading(true);
    setMarketingData(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-marketing', {
        body: {
          name: t.name,
          role: t.role,
          company: t.company,
          mentorshipType: t.mentorshipType,
          answers: t.answers,
          impactPhrase: t.impactPhrase,
          measurableResult: t.measurableResult,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setMarketingData(data as MarketingOutput);
      setMarketingCache(prev => ({ ...prev, [t.id]: data as MarketingOutput }));
    } catch (err: any) {
      toast({
        title: 'Erro ao gerar conteúdo',
        description: err?.message || 'Tente novamente em alguns segundos.',
        variant: 'destructive',
      });
      setMarketingModal(false);
    } finally {
      setMarketingLoading(false);
    }
  }, [marketingCache]);

  const handleExport = () => {
    const csv = exportToCSV(testimonials);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `depoimentos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStars = (score: number) => {
    const full = Math.round(score / 2);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= full ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
          />
        ))}
        <span className="ml-1.5 text-sm font-medium text-foreground">{score}</span>
      </div>
    );
  };

  // Background blobs shared component
  const PremiumBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-blob-move" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-3xl animate-blob-move" style={{ animationDelay: '-7s' }} />
    </div>
  );

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <PremiumBackground />
        <div className="glass-card rounded-2xl p-8 sm:p-12 w-full max-w-sm space-y-6 opacity-0 animate-fade-up text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">Área restrita</h1>
            <p className="text-muted-foreground text-sm mt-2">Digite a senha para acessar os depoimentos</p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
            className="space-y-4"
          >
            <Input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className={`rounded-xl h-12 text-center text-lg tracking-widest bg-background/60 border-border/50 focus:border-primary transition-colors ${error ? 'border-destructive shake' : ''}`}
            />
            {error && (
              <p className="text-destructive text-sm animate-fade-up">Senha incorreta</p>
            )}
            <Button type="submit" className="w-full rounded-xl h-12 text-base font-medium">
              Acessar
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <PremiumBackground />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 opacity-0 animate-fade-up">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">Depoimentos</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Painel de gestão e exportação
            </p>
          </div>
          {testimonials.length > 0 && (
            <Button
              onClick={handleExport}
              className="rounded-xl gap-2 h-11 px-6 hover:shadow-lg hover:shadow-primary/20 transition-shadow"
            >
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 opacity-0 animate-fade-up-delay-1">
            <div className="glass-card rounded-xl p-4 sm:p-5 text-center">
              <Users className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-semibold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Depoimentos</p>
            </div>
            <div className="glass-card rounded-xl p-4 sm:p-5 text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-semibold text-foreground">{stats.avg}</p>
              <p className="text-xs text-muted-foreground mt-1">Nota média</p>
            </div>
            <div className="glass-card rounded-xl p-4 sm:p-5 text-center">
              <ThumbsUp className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-semibold text-foreground">{stats.recPct}%</p>
              <p className="text-xs text-muted-foreground mt-1">Indicariam</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {testimonials.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center opacity-0 animate-fade-up-delay-1">
            <MessageSquareQuote className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum depoimento coletado ainda.</p>
            <p className="text-muted-foreground/60 text-sm mt-1">Compartilhe o formulário para começar a receber.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {testimonials.map((t, index) => (
              <div
                key={t.id}
                className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 opacity-0 animate-fade-up"
                style={{ animationDelay: `${0.15 + index * 0.08}s` }}
              >
                {/* Card header */}
                <div className="p-5 sm:p-6 pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {t.photo ? (
                        <img
                          src={t.photo}
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                          <span className="text-primary font-semibold text-lg">
                            {t.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground text-base">{t.name}</h3>
                        <p className="text-sm text-muted-foreground">{t.role} · {t.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                        <span>{mentorshipIcons[t.mentorshipType]}</span>
                        {mentorshipLabels[t.mentorshipType].split('/')[0].split('(')[0].trim()}
                      </span>
                      {renderStars(t.satisfactionScore)}
                    </div>
                  </div>
                </div>

                {/* Quote highlight */}
                {t.quote && (
                  <div className="px-4 sm:px-6 pt-5">
                    <div className="relative bg-primary/[0.04] rounded-xl p-4 sm:p-5 border-l-[3px] border-primary/40">
                      <span className="absolute -top-2 left-2 sm:left-3 text-4xl sm:text-5xl text-primary/20 font-display leading-none select-none">"</span>
                      <p className="font-display italic text-foreground text-sm sm:text-lg leading-relaxed pl-3 sm:pl-4">
                        {t.quote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Before / After / Result */}
                {(t.before || t.after || t.result) && (
                  <div className="px-5 sm:px-6 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {t.before && (
                        <div className="rounded-xl border border-border/50 p-4 bg-background/40">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-[10px]">📍</span>
                            </div>
                            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Antes</p>
                          </div>
                          <p className="text-foreground text-sm leading-relaxed line-clamp-4">{t.before}</p>
                        </div>
                      )}
                      {t.after && (
                        <div className="rounded-xl border border-primary/20 p-4 bg-primary/[0.03]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                              <ArrowRight className="h-3 w-3 text-primary" />
                            </div>
                            <p className="font-medium text-primary/70 text-xs uppercase tracking-wide">Depois</p>
                          </div>
                          <p className="text-foreground text-sm leading-relaxed line-clamp-4">{t.after}</p>
                        </div>
                      )}
                      {t.result && (
                        <div className="rounded-xl border border-primary/30 p-4 bg-primary/[0.06]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                            <p className="font-medium text-primary/80 text-xs uppercase tracking-wide">Resultado</p>
                          </div>
                          <p className="text-foreground text-sm leading-relaxed line-clamp-4">{t.result}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="px-4 sm:px-6 py-4 mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateMarketing(t)}
                      className="gap-1.5 text-xs rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Gerar Marketing
                    </Button>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${t.wouldRecommend ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                      {t.wouldRecommend ? '✓ Indicaria' : '✗ Não indicaria'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <MarketingModal
          open={marketingModal}
          onOpenChange={setMarketingModal}
          data={marketingData}
          loading={marketingLoading}
          attribution={marketingAttribution}
        />
      </div>
    </div>
  );
};

export default Admin;
