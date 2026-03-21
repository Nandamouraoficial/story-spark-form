DROP POLICY IF EXISTS "Anyone can read testimonials" ON public.testimonials;

CREATE POLICY "No public read access to testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (false);