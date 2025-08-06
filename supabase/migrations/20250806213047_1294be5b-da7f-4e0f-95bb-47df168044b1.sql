-- Update Elena's tavus_config with the provided settings
UPDATE public.therapists 
SET tavus_config = jsonb_build_object(
  'replica_id', 'rbe36ab0b5c4',
  'persona_id', 'pbf46a60360c', 
  'custom_greeting', 'I''m so happy to see you today! sweetheart. Come sit, What''s been on your mind lately?'
)
WHERE name = 'Elena';