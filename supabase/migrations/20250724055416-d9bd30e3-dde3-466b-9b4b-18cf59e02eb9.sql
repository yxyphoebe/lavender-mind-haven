-- Create new storage bucket for onboarding images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('onboarding-images', 'onboarding-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for public access to onboarding images
CREATE POLICY "Allow public access to onboarding images"
ON storage.objects FOR SELECT
USING (bucket_id = 'onboarding-images');

CREATE POLICY "Allow public uploads to onboarding images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'onboarding-images');

CREATE POLICY "Allow public delete from onboarding images"
ON storage.objects FOR DELETE
USING (bucket_id = 'onboarding-images');