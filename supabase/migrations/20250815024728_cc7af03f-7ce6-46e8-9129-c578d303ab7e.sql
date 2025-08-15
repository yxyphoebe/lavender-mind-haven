-- Add active field to therapists table
ALTER TABLE public.therapists 
ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;

-- Set specific therapists as active
UPDATE public.therapists 
SET active = true 
WHERE name IN ('Sage', 'Camille', 'Elena', 'Julie');

-- Set other therapists as inactive
UPDATE public.therapists 
SET active = false 
WHERE name NOT IN ('Sage', 'Camille', 'Elena', 'Julie');