DROP POLICY IF EXISTS "No public read access to testimonials" ON public.testimonials;

CREATE POLICY "Allow read testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (true);