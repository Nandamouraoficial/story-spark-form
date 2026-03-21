import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Testimonial,
  getTestimonials,
  exportToCSV,
  mentorshipLabels,
} from '@/lib/testimonial-data';
import { Download, Star, Lock } from 'lucide-react';

const ADMIN_PASSWORD = 'admin2024';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (!authenticated) {
      const pwd = prompt('Digite a senha de acesso:');
      if (pwd === ADMIN_PASSWORD) {
        setAuthenticated(true);
      }
    }
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) {
      setTestimonials(getTestimonials());
    }
  }, [authenticated]);

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

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
            Acesso restrito
          </p>
          <Button onClick={() => setAuthenticated(false)} variant="outline" className="rounded-xl">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Depoimentos</h1>
            <p className="text-muted-foreground text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {testimonials.length} depoimento{testimonials.length !== 1 ? 's' : ''} coletado{testimonials.length !== 1 ? 's' : ''}
            </p>
          </div>
          {testimonials.length > 0 && (
            <Button onClick={handleExport} className="rounded-xl gap-2">
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
          )}
        </div>

        {testimonials.length === 0 ? (
          <Card className="rounded-xl">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                Nenhum depoimento ainda.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <Card key={t.id} className="rounded-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {t.photo && (
                        <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                      )}
                      <div>
                        <CardTitle className="text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {t.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {t.role} · {t.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="rounded-lg text-xs">
                        {mentorshipLabels[t.mentorshipType].split('/')[0].trim()}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-primary">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {t.satisfactionScore}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {t.quote && (
                    <blockquote className="border-l-2 border-primary pl-4 italic text-foreground text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      "{t.quote}"
                    </blockquote>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {t.before && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="font-medium text-muted-foreground text-xs mb-1">Antes</p>
                        <p className="text-foreground line-clamp-3">{t.before}</p>
                      </div>
                    )}
                    {t.after && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="font-medium text-muted-foreground text-xs mb-1">Depois</p>
                        <p className="text-foreground line-clamp-3">{t.after}</p>
                      </div>
                    )}
                    {t.result && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="font-medium text-muted-foreground text-xs mb-1">Resultado</p>
                        <p className="text-foreground line-clamp-3">{t.result}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {new Date(t.timestamp).toLocaleDateString('pt-BR')} · {t.wouldRecommend ? 'Indicaria ✓' : 'Não indicaria'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
