
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  mentorship_type text NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  impact_phrase text NOT NULL DEFAULT '',
  measurable_result text NOT NULL DEFAULT '',
  satisfaction_score integer NOT NULL DEFAULT 10,
  would_recommend boolean NOT NULL DEFAULT true,
  authorized boolean NOT NULL DEFAULT true,
  photo text,
  summary text NOT NULL DEFAULT '',
  quote text NOT NULL DEFAULT '',
  before_text text NOT NULL DEFAULT '',
  after_text text NOT NULL DEFAULT '',
  result_text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert testimonials"
  ON public.testimonials FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (true);
