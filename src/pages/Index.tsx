import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  MentorshipType,
  mentorshipLabels,
  conditionalQuestions,
  generateSmartFields,
  saveTestimonial,
  Testimonial,
} from '@/lib/testimonial-data';
import { ArrowRight, ArrowLeft, Send, CheckCircle2, Upload } from 'lucide-react';

const TOTAL_STEPS = 7;

const Index = () => {
  const [step, setStep] = useState(0);

  // Step 2 - Identification
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');

  // Step 3 - Segmentation
  const [mentorshipType, setMentorshipType] = useState<MentorshipType | ''>('');

  // Step 4 - Conditional answers
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);

  // Step 5 - Complementary
  const [impactPhrase, setImpactPhrase] = useState('');
  const [measurableResult, setMeasurableResult] = useState('');
  const [satisfactionScore, setSatisfactionScore] = useState(8);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);

  // Step 6 - Authorization
  const [authorized, setAuthorized] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const [errors, setErrors] = useState<string[]>([]);

  const updateAnswer = useCallback((index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (step === 1) {
      if (!name.trim()) errs.push('Nome é obrigatório');
      if (!role.trim()) errs.push('Cargo é obrigatório');
      if (!company.trim()) errs.push('Empresa é obrigatória');
    }
    if (step === 2) {
      if (!mentorshipType) errs.push('Selecione o tipo de mentoria');
    }
    if (step === 3) {
      if (answers.some((a) => !a.trim())) errs.push('Responda todas as perguntas');
    }
    if (step === 4) {
      if (!impactPhrase.trim()) errs.push('Preencha a frase de impacto');
      if (wouldRecommend === null) errs.push('Indique se recomendaria');
    }
    if (step === 5) {
      if (!authorized) errs.push('A autorização é obrigatória');
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step === 5) {
      // Submit
      const type = mentorshipType as MentorshipType;
      const smart = generateSmartFields(type, answers, impactPhrase, measurableResult, name);
      const testimonial: Testimonial = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        mentorshipType: type,
        answers,
        impactPhrase: impactPhrase.trim(),
        measurableResult: measurableResult.trim(),
        satisfactionScore,
        wouldRecommend: wouldRecommend!,
        authorized,
        photo,
        ...smart,
      };
      saveTestimonial(testimonial);
      setStep(6);
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors(['A foto deve ter no máximo 2MB']);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const progress = step < 6 ? ((step + 1) / (TOTAL_STEPS - 1)) * 100 : 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 sm:py-16">
      <div className="w-full max-w-xl">
        {/* Progress bar */}
        {step > 0 && step < 6 && (
          <div className="mb-8">
            <div className="h-1 w-full rounded-full bg-secondary">
              <div
                className="h-1 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground text-right">
              {step} de 6
            </p>
          </div>
        )}

        {/* Step 0 - Welcome */}
        {step === 0 && (
          <div className="text-center space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight font-display">
                Sua experiência pode transformar outras carreiras
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                São apenas 4 perguntas rápidas. Responda com suas palavras — simples e direto.
              </p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-5 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Posso usar seu depoimento com seu nome e cargo na minha página e materiais?
              </p>
            </div>
            <Button
              onClick={() => setStep(1)}
              size="lg"
              className="px-10 py-6 text-base font-medium rounded-xl"
            >
              Começar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 1 - Identification */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Sobre você
              </h2>
              <p className="text-muted-foreground mt-1 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Como podemos te identificar no depoimento
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label style={{ fontFamily: 'Inter, sans-serif' }}>Nome completo</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maria Silva"
                  maxLength={100}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ fontFamily: 'Inter, sans-serif' }}>Cargo atual</Label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Diretora de Marketing"
                  maxLength={100}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ fontFamily: 'Inter, sans-serif' }}>Empresa ou segmento</Label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Empresa XYZ / Tecnologia"
                  maxLength={100}
                  className="rounded-xl h-12"
                />
              </div>
            </div>
            {renderErrors()}
            {renderNav(true)}
          </div>
        )}

        {/* Step 2 - Segmentation */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Tipo de mentoria
              </h2>
              <p className="text-muted-foreground mt-1 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Qual tipo de mentoria você fez?
              </p>
            </div>
            <RadioGroup
              value={mentorshipType}
              onValueChange={(v) => setMentorshipType(v as MentorshipType)}
              className="space-y-3"
            >
              {(Object.keys(mentorshipLabels) as MentorshipType[]).map((type) => (
                <label
                  key={type}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    mentorshipType === type
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <RadioGroupItem value={type} className="mt-0.5" />
                  <span className="text-sm leading-relaxed text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {mentorshipLabels[type]}
                  </span>
                </label>
              ))}
            </RadioGroup>
            {renderErrors()}
            {renderNav(true)}
          </div>
        )}

        {/* Step 3 - Conditional Questions */}
        {step === 3 && mentorshipType && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Sua experiência
              </h2>
              <p className="text-muted-foreground mt-1 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Conte com suas palavras — sem pressa
              </p>
            </div>
            <div className="space-y-5">
              {conditionalQuestions[mentorshipType as MentorshipType].map((q, i) => (
                <div key={i} className="space-y-2">
                  <Label className="text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {i + 1}. {q}
                  </Label>
                  <Textarea
                    value={answers[i]}
                    onChange={(e) => updateAnswer(i, e.target.value)}
                    placeholder="Escreva sua resposta aqui..."
                    className="rounded-xl min-h-[100px] resize-none"
                    maxLength={1000}
                  />
                </div>
              ))}
            </div>
            {renderErrors()}
            {renderNav(true)}
          </div>
        )}

        {/* Step 4 - Complementary */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Para enriquecer
              </h2>
              <p className="text-muted-foreground mt-1 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Detalhes que fazem a diferença
              </p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label style={{ fontFamily: 'Inter, sans-serif' }}>
                  Em uma frase: qual foi o maior impacto da mentoria na sua vida?
                </Label>
                <Input
                  value={impactPhrase}
                  onChange={(e) => setImpactPhrase(e.target.value)}
                  placeholder="Ex: Descobri que era possível recomeçar com segurança"
                  maxLength={200}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ fontFamily: 'Inter, sans-serif' }}>
                  Você teve algum resultado mensurável?
                </Label>
                <Input
                  value={measurableResult}
                  onChange={(e) => setMeasurableResult(e.target.value)}
                  placeholder="Ex: promoção, aumento salarial, novos clientes..."
                  maxLength={200}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-3">
                <Label style={{ fontFamily: 'Inter, sans-serif' }}>
                  Nota de satisfação: <span className="text-primary font-semibold">{satisfactionScore}</span>
                </Label>
                <Slider
                  value={[satisfactionScore]}
                  onValueChange={(v) => setSatisfactionScore(v[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label style={{ fontFamily: 'Inter, sans-serif' }}>Você indicaria essa mentoria?</Label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={wouldRecommend === true ? 'default' : 'outline'}
                    onClick={() => setWouldRecommend(true)}
                    className="rounded-xl flex-1"
                  >
                    Sim
                  </Button>
                  <Button
                    type="button"
                    variant={wouldRecommend === false ? 'default' : 'outline'}
                    onClick={() => setWouldRecommend(false)}
                    className="rounded-xl flex-1"
                  >
                    Não
                  </Button>
                </div>
              </div>
            </div>
            {renderErrors()}
            {renderNav(true)}
          </div>
        )}

        {/* Step 5 - Authorization */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Quase lá
              </h2>
              <p className="text-muted-foreground mt-1 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Autorização e foto opcional
              </p>
            </div>
            <div className="space-y-5">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-border cursor-pointer hover:border-primary/30 transition-all">
                <Checkbox
                  checked={authorized}
                  onCheckedChange={(v) => setAuthorized(v === true)}
                  className="mt-0.5"
                />
                <span className="text-sm leading-relaxed text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Autorizo o uso do meu depoimento para fins de divulgação
                </span>
              </label>
              <div className="space-y-2">
                <Label style={{ fontFamily: 'Inter, sans-serif' }}>Foto (opcional, máx. 2MB)</Label>
                <div className="flex items-center gap-4">
                  {photo && (
                    <img
                      src={photo}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border cursor-pointer hover:border-primary/50 transition-all text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>
                      {photo ? 'Trocar foto' : 'Enviar foto'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            {renderErrors()}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="rounded-xl"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 rounded-xl py-6 text-base font-medium"
              >
                <Send className="mr-2 h-4 w-4" /> Enviar meu depoimento
              </Button>
            </div>
          </div>
        )}

        {/* Step 6 - Confirmation */}
        {step === 6 && (
          <div className="text-center space-y-6 animate-in fade-in duration-500 py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Obrigada!
              </h2>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Obrigada por compartilhar sua jornada. Sua história pode inspirar outras pessoas a darem o próximo passo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function renderErrors() {
    if (errors.length === 0) return null;
    return (
      <div className="text-sm text-destructive space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        {errors.map((e, i) => (
          <p key={i}>• {e}</p>
        ))}
      </div>
    );
  }

  function renderNav(showBack: boolean) {
    return (
      <div className="flex gap-3 pt-4">
        {showBack && step > 0 && (
          <Button variant="outline" onClick={handleBack} className="rounded-xl">
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Button>
        )}
        <Button onClick={handleNext} className="flex-1 rounded-xl py-6 text-base font-medium">
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }
};

export default Index;
