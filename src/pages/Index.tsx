import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { analyzeResponseQuality, getExampleForQuestion, QualityLevel } from '@/lib/response-validation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

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
import { getChipsForQuestion } from '@/lib/chip-options';
import { ArrowRight, ArrowLeft, Send, Upload, Check, Sparkles, Rocket, Target, Lightbulb, Linkedin, AlertCircle, CheckCircle } from 'lucide-react';

const TOTAL_STEPS = 7;

const mentorshipIcons: Record<MentorshipType, React.ReactNode> = {
  empreendedorismo: <Rocket className="h-5 w-5" />,
  crescimento: <Target className="h-5 w-5" />,
  virada: <Lightbulb className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
};

const satisfactionEmojis = ['😔', '😔', '😐', '😐', '🙂', '🙂', '😊', '😊', '😄', '🤩', '🤩'];

const Index = () => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [stepKey, setStepKey] = useState(0);
  const [staggerReady, setStaggerReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Step 2 - Identification
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');

  // Step 3 - Segmentation
  const [mentorshipType, setMentorshipType] = useState<MentorshipType | ''>('');

  // Step 4 - Conditional answers (one question at a time)
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Step 5 - Complementary
  const [impactPhrase, setImpactPhrase] = useState('');
  const [measurableResult, setMeasurableResult] = useState('');
  const [satisfactionScore, setSatisfactionScore] = useState(8);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);

  // Step 6 - Authorization
  const [authorized, setAuthorized] = useState(true);
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const [errors, setErrors] = useState<string[]>([]);
  const [selectedChips, setSelectedChips] = useState<Record<number, string[]>>({});
  const [otherOpen, setOtherOpen] = useState<Record<number, boolean>>({});
  const [otherText, setOtherText] = useState<Record<number, string>>({});

  // Non-blocking quality suggestions
  const [weakWarning, setWeakWarning] = useState<Record<number, boolean>>({});
  const [weakDismissed, setWeakDismissed] = useState<Record<number, boolean>>({});

  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setStaggerReady(true), 50);
    return () => clearTimeout(timer);
  }, [stepKey]);

  // Safety: recover from invalid question index via useEffect, never during render
  useEffect(() => {
    if (step === 3 && mentorshipType) {
      const questions = conditionalQuestions[mentorshipType as MentorshipType] || [];
      if (currentQuestion >= questions.length && questions.length > 0) {
        
        setCurrentQuestion(0);
        setStep(4);
        setStepKey((k) => k + 1);
        setStaggerReady(false);
        setErrors([]);
      }
    }
  }, [step, currentQuestion, mentorshipType]);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  const updateAnswer = useCallback((index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const buildCombinedAnswer = (index: number, freeText: string, chips: string[], otherVal: string) => {
    const allChips = otherVal ? [...chips, `Outro: ${otherVal}`] : chips;
    const chipPrefix = allChips.length > 0 ? '✦ ' + allChips.join(' · ') : '';
    return [chipPrefix, freeText].filter(Boolean).join('\n');
  };

  const getFreeText = (answer: string) => {
    return answer
      ?.split('\n')
      .filter((line) => !line.startsWith('✦'))
      .join('\n') || '';
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (step === 1) {
      if (!name.trim()) errs.push('Nome é obrigatório');
      else if (name.trim().split(/\s+/).length < 2) errs.push('Informe seu nome completo (nome e sobrenome)');
      if (!role.trim()) errs.push('Cargo é obrigatório');
      if (!company.trim()) errs.push('Empresa é obrigatória');
    }
    if (step === 2) {
      if (!mentorshipType) errs.push('Selecione o tipo de mentoria');
    }
    if (step === 3) {
      const answer = answers[currentQuestion];
      const hasChips = (selectedChips[currentQuestion] || []).length > 0;
      const hasOther = !!(otherText[currentQuestion] || '').trim();
      if (!answer.trim() && !hasChips && !hasOther) {
        errs.push('Responda a pergunta antes de continuar');
      } else {
        // Non-blocking quality check
        const analysis = analyzeResponseQuality(answer, hasChips || hasOther);
        if (analysis.level === 'weak' && !weakDismissed[currentQuestion]) {
          setWeakWarning((prev) => ({ ...prev, [currentQuestion]: true }));
        } else {
          setWeakWarning((prev) => ({ ...prev, [currentQuestion]: false }));
        }
      }
    }
    if (step === 4) {
      if (!impactPhrase.trim()) errs.push('Preencha a frase de impacto');
      if (wouldRecommend === null) errs.push('Indique se recomendaria');
    }
    if (step === 5) {
      // Authorization is optional — user already chose in step 0
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const navigateStep = (newStep: number, dir: 'forward' | 'back') => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setStep(newStep);
      setStepKey((k) => k + 1);
      setStaggerReady(false);
      setAnimating(false);
      setErrors([]);
    }, 200);
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step === 3) {
      const questions = conditionalQuestions[mentorshipType as MentorshipType] || [];
      const totalQuestions = questions.length;
      if (!totalQuestions) {
        setStep(4);
        setStepKey((k) => k + 1);
        setStaggerReady(false);
        setErrors([]);
        return;
      }
      console.log('STEP3_CONTINUE', { step, currentQuestion, totalQuestions, isLastQuestion: currentQuestion >= totalQuestions - 1 });
      if (currentQuestion >= totalQuestions - 1) {
        // Transition immediately — no navigateStep delay
        setCurrentQuestion(0);
        setAnimating(false);
        setStep(4);
        setStepKey((k) => k + 1);
        setStaggerReady(false);
        setErrors([]);
        return;
      }
      setCurrentQuestion(currentQuestion + 1);
      setStepKey((k) => k + 1);
      setStaggerReady(false);
      setErrors([]);
      return;
    }
    if (step === 5) {
      // Submit with robust error handling
      setSubmitting(true);
      const type = mentorshipType as MentorshipType;
      try {
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
        saveTestimonial(testimonial).catch((err) => console.error('Failed to save:', err));
      } catch (err) {
        console.error('Error preparing testimonial:', err);
      } finally {
        setSubmitting(false);
        navigateStep(6, 'forward');
      }
      return;
    }
    navigateStep(step + 1, 'forward');
  };

  const handleBack = () => {
    if (step === 3 && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setStepKey((k) => k + 1);
      setStaggerReady(false);
      setErrors([]);
      return;
    }
    if (step === 3 && currentQuestion === 0) {
      setCurrentQuestion(0);
    }
    navigateStep(step - 1, 'back');
  };

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

  const stepLabels = ['Início', 'Identificação', 'Mentoria', 'Experiência', 'Detalhes', 'Autorização', 'Enviado'];

  const renderQuestionChips = (i: number) => {
    if (!mentorshipType) return null;
    const chips = getChipsForQuestion(mentorshipType as MentorshipType, i);
    const selected = selectedChips[i] || [];
    if (chips.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2.5 animate-scale-fade-in">
          {chips.map((chip, chipIndex) => {
            const isSelected = selected.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  const next = isSelected
                    ? selected.filter((c) => c !== chip)
                    : [...selected, chip];
                  setSelectedChips((prev) => ({ ...prev, [i]: next }));
                  const freeText = getFreeText(answers[i]);
                  const otherVal = otherText[i]?.trim() || '';
                  updateAnswer(i, buildCombinedAnswer(i, freeText, next, otherVal));
                }}
                className={`text-left rounded-xl px-4 py-2.5 text-sm font-medium border transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary/15 border-primary text-primary'
                    : 'bg-background/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {chipIndex + 1}. {chip}
              </button>
            );
          })}
          {/* Outro... chip */}
          <button
            type="button"
            onClick={() => setOtherOpen((prev) => ({ ...prev, [i]: !prev[i] }))}
            className={`text-left rounded-xl px-4 py-2.5 text-sm font-medium border border-dashed transition-all duration-200 ${
              otherOpen[i]
                ? 'bg-primary/15 border-primary text-primary'
                : 'bg-background/50 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
            }`}
          >
            Outro...
          </button>
        </div>
        {otherOpen[i] && (
          <div className="animate-scale-fade-in">
            <Textarea
              value={otherText[i] || ''}
              onChange={(e) => {
                const val = e.target.value;
                setOtherText((prev) => ({ ...prev, [i]: val }));
                const freeText = getFreeText(answers[i]);
                updateAnswer(i, buildCombinedAnswer(i, freeText, selected, val.trim()));
              }}
              placeholder="Escreva sua opção..."
              className="rounded-xl min-h-[60px] resize-none premium-input text-sm"
              maxLength={300}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 sm:py-16 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="bg-blob w-[60vw] max-w-[500px] h-[60vw] max-h-[500px] bg-primary/20 top-[-200px] left-[-100px] animate-blob-move" />
      <div className="bg-blob w-[50vw] max-w-[400px] h-[50vw] max-h-[400px] bg-primary/10 bottom-[-150px] right-[-100px] animate-blob-move" style={{ animationDelay: '-7s' }} />
      <div className="bg-blob w-[40vw] max-w-[300px] h-[40vw] max-h-[300px] bg-primary/15 top-[40%] right-[10%] animate-blob-move" style={{ animationDelay: '-14s' }} />

      <div className="w-full max-w-xl relative z-10">
        {/* Progress Dots */}
        {step > 0 && step < 6 && (
          <div className="mb-10 opacity-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`progress-dot w-3 h-3 rounded-full transition-all duration-500 ease-out ${
                      s < step
                        ? 'completed bg-primary'
                        : s === step
                        ? 'active bg-primary animate-dot-pulse'
                        : 'upcoming bg-border'
                    }`}
                  />
                  {s < 5 && (
                    <div
                      className={`w-8 h-0.5 rounded-full transition-all duration-500 ${
                        s < step ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center mt-3 text-xs text-muted-foreground font-medium tracking-wide uppercase">
              {stepLabels[step]}
              {step === 3 && mentorshipType && (() => {
                const total = conditionalQuestions[mentorshipType as MentorshipType]?.length || 4;
                const safe = Math.min(currentQuestion, total - 1);
                return ` — ${safe + 1}/${total}`;
              })()}
            </p>
          </div>
        )}

        {/* Step Container with transitions */}
        <div
          key={stepKey}
          className={`transition-all duration-500 ease-out ${
            animating
              ? direction === 'forward'
                ? 'opacity-0 translate-y-3'
                : 'opacity-0 -translate-y-3'
              : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Step 0 - Welcome */}
          {step === 0 && (
            <div className={`text-center stagger-children ${staggerReady ? 'animate' : ''}`}>
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-glow-pulse" />
                </div>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    <Sparkles className="h-4 w-4" />
                    <span>Depoimento</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight font-display mb-5">
                Sua experiência pode {' '}
                <span className="text-primary">transformar</span> outras carreiras
              </h1>

              <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-6">
                Leva menos de 5 minutos. Responda com suas palavras — simples e direto.
              </p>


              <Button
                onClick={() => navigateStep(1, 'forward')}
                className="rounded-full px-8 py-3 text-base font-medium"
              >
                Começar
              </Button>
            </div>
          )}

          {/* Step 1 - Identification */}
          {step === 1 && (
            <div className={`glass-card rounded-2xl p-6 sm:p-8 stagger-children ${staggerReady ? 'animate' : ''}`}>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground font-display">
                  Sobre você
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Como podemos te identificar no depoimento
                </p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Maria Silva"
                    maxLength={100}
                    className="rounded-xl h-12 premium-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo atual</Label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Diretora de Marketing"
                    maxLength={100}
                    className="rounded-xl h-12 premium-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Empresa ou segmento</Label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Empresa XYZ / Tecnologia"
                    maxLength={100}
                    className="rounded-xl h-12 premium-input"
                  />
                </div>
              </div>
              {renderErrors()}
              {renderNav(true)}
            </div>
          )}

          {/* Step 2 - Segmentation */}
          {step === 2 && (
            <div className={`glass-card rounded-2xl p-6 sm:p-8 stagger-children ${staggerReady ? 'animate' : ''}`}>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground font-display">
                  Tipo de mentoria
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
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
                    className={`selection-card flex items-center gap-4 p-4 sm:p-5 rounded-xl border cursor-pointer ${
                      mentorshipType === type
                        ? 'selected border-primary bg-primary/5 glow-shadow'
                        : 'border-border hover:border-primary/30 hover:bg-primary/[0.02]'
                    }`}
                    style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      mentorshipType === type
                        ? 'bg-primary text-primary-foreground scale-110'
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {mentorshipIcons[type]}
                    </div>
                    <span className="text-sm leading-relaxed text-foreground flex-1">
                      {mentorshipLabels[type]}
                    </span>
                    <RadioGroupItem value={type} className="mt-0" />
                  </label>
                ))}
              </RadioGroup>
              {renderErrors()}
              {renderNav(true)}
            </div>
          )}

          {/* Step 3 - One Question at a Time */}
          {step === 3 && mentorshipType && (() => {
            const questions = conditionalQuestions[mentorshipType as MentorshipType] || [];
            const totalQuestions = questions.length;
            if (!totalQuestions || currentQuestion >= totalQuestions) {
              // Fallback visual while useEffect recovers the state
              return (
                <div className="glass-card rounded-2xl shadow-xl px-6 py-10 max-w-lg mx-auto text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span className="text-sm">Preparando próxima etapa...</span>
                  </div>
                </div>
              );
            }
            const i = currentQuestion;
            const q = questions[i];
            if (!q) {
              return (
                <div className="glass-card rounded-2xl shadow-xl px-6 py-10 max-w-lg mx-auto text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span className="text-sm">Preparando próxima etapa...</span>
                  </div>
                </div>
              );
            }
            const selected = selectedChips[i] || [];

            return (
              <div className={`glass-card rounded-2xl p-6 sm:p-8 stagger-children ${staggerReady ? 'animate' : ''}`}>
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-foreground font-display">
                    Sua experiência
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Pergunta {i + 1} de 4 — conte com suas palavras
                  </p>
                </div>
                <div className="space-y-4">
                  <Label className="text-sm leading-relaxed">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold mr-2">
                      {i + 1}
                    </span>
                    {q}
                  </Label>
                  {renderQuestionChips(i)}
                  <Textarea
                    ref={(el) => { textareaRefs.current[i] = el; }}
                    value={getFreeText(answers[i])}
                    onChange={(e) => {
                      const freeText = e.target.value;
                      const otherVal = otherText[i]?.trim() || '';
                      updateAnswer(i, buildCombinedAnswer(i, freeText, selected, otherVal));
                      autoResize(e.target);
                      if (weakWarning[i]) {
                        setWeakWarning((prev) => ({ ...prev, [i]: false }));
                        setWeakDismissed((prev) => ({ ...prev, [i]: false }));
                      }
                    }}
                    placeholder={getChipsForQuestion(mentorshipType as MentorshipType, i).length > 0
                      ? 'Selecione opções acima e/ou escreva com suas palavras...'
                      : 'Escreva sua resposta aqui...'}
                    className="rounded-xl min-h-[100px] resize-none premium-input auto-resize transition-all duration-300"
                    maxLength={1000}
                  />
                  {/* Non-blocking weak warning */}
                  {weakWarning[i] && !weakDismissed[i] && (
                    <div className="animate-scale-fade-in">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
                        <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400 flex-1">
                          Se quiser, complemente com um exemplo curto
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setWeakDismissed((prev) => ({ ...prev, [i]: true }))}
                          className="text-xs h-7 px-2 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                        >
                          Continuar assim mesmo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                {renderErrors()}
                <div className="flex gap-3 pt-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 rounded-xl py-6 text-base font-medium glow-shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    {currentQuestion < (conditionalQuestions[mentorshipType as MentorshipType]?.length || 4) - 1 ? 'Próxima' : 'Continuar'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })()}

          {/* Step 4 - Complementary */}
          {step === 4 && (
            <div className={`glass-card rounded-2xl p-6 sm:p-8 stagger-children ${staggerReady ? 'animate' : ''}`}>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground font-display">
                  Para enriquecer
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Detalhes que fazem a diferença
                </p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>
                    Em uma frase: qual foi o maior impacto da mentoria na sua vida?
                  </Label>
                  <Input
                    value={impactPhrase}
                    onChange={(e) => setImpactPhrase(e.target.value)}
                    placeholder="Ex: Descobri que era possível recomeçar com segurança"
                    maxLength={200}
                    className="rounded-xl h-12 premium-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Você teve algum resultado mensurável?
                  </Label>
                  <Input
                    value={measurableResult}
                    onChange={(e) => setMeasurableResult(e.target.value)}
                    placeholder="Ex: promoção, aumento salarial, novos clientes..."
                    maxLength={200}
                    className="rounded-xl h-12 premium-input"
                  />
                </div>

                {/* Satisfaction Slider */}
                <div className="space-y-4">
                  <Label>Nota de satisfação</Label>
                  <div className="text-center">
                    <div className="text-5xl mb-2 transition-all duration-300" key={satisfactionScore}>
                      {satisfactionEmojis[satisfactionScore]}
                    </div>
                    <div className="text-3xl font-display font-semibold text-primary transition-all duration-300">
                      {satisfactionScore}
                    </div>
                  </div>
                  <div className="relative px-1">
                    <div className="h-2 rounded-full gradient-track" />
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={satisfactionScore}
                      onChange={(e) => setSatisfactionScore(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-2 border-primary shadow-lg pointer-events-none transition-all duration-200 ease-out hover:scale-110"
                      style={{ left: `calc(${(satisfactionScore / 10) * 100}% - 12px)` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>0</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Would Recommend */}
                <div className="space-y-3">
                  <Label>Você indicaria essa mentoria?</Label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(true)}
                      className={`flex-1 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-300 ease-out flex items-center justify-center gap-2 ${
                        wouldRecommend === true
                          ? 'border-primary bg-primary text-primary-foreground scale-[1.02] glow-shadow'
                          : 'border-border text-foreground hover:border-primary/30'
                      }`}
                      style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      {wouldRecommend === true && <Check className="h-4 w-4 animate-scale-fade-in" />}
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(false)}
                      className={`flex-1 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-300 ease-out flex items-center justify-center gap-2 ${
                        wouldRecommend === false
                          ? 'border-primary bg-primary text-primary-foreground scale-[1.02] glow-shadow'
                          : 'border-border text-foreground hover:border-primary/30'
                      }`}
                      style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      {wouldRecommend === false && <Check className="h-4 w-4 animate-scale-fade-in" />}
                      Não
                    </button>
                  </div>
                </div>
              </div>
              {renderErrors()}
              {renderNav(true)}
            </div>
          )}

          {/* Step 5 - Authorization */}
          {step === 5 && (
            <div className={`glass-card rounded-2xl p-6 sm:p-8 stagger-children ${staggerReady ? 'animate' : ''}`}>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground font-display">
                  Quase lá
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Autorização e foto opcional
                </p>
              </div>
              <div className="space-y-6">
                <label
                  className={`selection-card flex items-start gap-3 p-5 rounded-xl border-2 cursor-pointer ${
                    authorized
                      ? 'selected border-primary bg-primary/5 glow-shadow'
                      : 'border-border hover:border-primary/30'
                  }`}
                  style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <Checkbox
                    checked={authorized}
                    onCheckedChange={(v) => setAuthorized(v === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    Autorizo o uso do meu depoimento para fins de divulgação
                  </span>
                </label>

                {/* Photo Upload */}
                <div className="space-y-3">
                  <Label>Foto (opcional, máx. 2MB)</Label>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {photo && (
                      <div className="animate-scale-fade-in">
                        <img
                          src={photo}
                          alt="Preview"
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/20 glow-shadow"
                        />
                      </div>
                    )}
                    <label className="group flex-1 flex flex-col items-center gap-3 px-6 py-8 rounded-2xl border-2 border-dashed border-border cursor-pointer hover:border-primary/50 hover:bg-primary/[0.02] transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {photo ? 'Trocar foto' : 'Clique para enviar'}
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
              <div className="flex gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={submitting}
                  className="flex-1 rounded-xl py-6 text-base font-medium glow-shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <Send className="mr-2 h-4 w-4" /> {submitting ? 'Enviando...' : 'Enviar meu depoimento'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 6 - Confirmation (also default fallback) */}
          {(step === 6 || step > 6) && (
            <ConfirmationScreen />
          )}

          {/* Safety fallback — never show blank */}
          {step < 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Depoimento enviado com sucesso. Obrigada por compartilhar sua experiência.</p>
            </div>
          )}

          {/* Fallback for step 3 without mentorshipType */}
          {step === 3 && !mentorshipType && (
            <div className="glass-card rounded-2xl shadow-xl px-6 py-10 max-w-lg mx-auto text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="text-sm">Preparando perguntas...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function renderErrors() {
    if (errors.length === 0) return null;
    return (
      <div className="text-sm text-destructive space-y-1 mt-4 animate-scale-fade-in">
        {errors.map((e, i) => (
          <p key={i}>• {e}</p>
        ))}
      </div>
    );
  }

  function renderNav(showBack: boolean) {
    return (
      <div className="flex gap-3 pt-6">
        {showBack && step > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Button>
        )}
        <Button
          onClick={handleNext}
          className="flex-1 rounded-xl py-6 text-base font-medium glow-shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }
};

/* Confirmation screen */
const ConfirmationScreen = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="text-center py-12 relative">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="sparkle-particle animate-sparkle absolute"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 0.3}s`,
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            opacity: 0.6,
          }}
        />
      ))}

      <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 animate-scale-fade-in glow-shadow">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-primary">
          <path
            d="M12 24L20 32L36 16"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="draw-check-path animate-draw-check"
          />
        </svg>
      </div>

      <div className={`space-y-4 transition-all duration-700 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground font-display">
          Obrigada!
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed text-base">
          Obrigada por compartilhar sua jornada. Sua história pode inspirar outras pessoas a darem o próximo passo.
        </p>
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Depoimento enviado com sucesso</span>
          </div>
        </div>
      </div>

      <a
        href="/admin"
        className="fixed bottom-4 right-4 text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors z-10"
      >
        admin
      </a>
    </div>
  );
};

export default Index;
