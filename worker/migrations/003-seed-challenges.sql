-- Migration: Seed weekly challenges (weeks 2-17) and switch to date-based rotation
-- Week 1 already exists from initial migration; clear the manual is_active flag

UPDATE challenges SET is_active = 0 WHERE week_number = 1;

INSERT INTO challenges (week_number, name, description, rules, prize, start_date, end_date, is_active) VALUES
(2,  'The Great Pushup War',   'Most pushups in 7 days. Variations allowed. Chest to floor or it doesn''t count.',
     'All pushup variations count|Log daily totals|Video proof for sets over 100|Most total pushups wins',
     'Pushup Crown + Bragging Rights', '2026-02-12', '2026-02-19', 0),

(3,  'Plank Masters',          'Longest cumulative plank time over the week. Core strength showdown.',
     'Any plank variation counts|Timer proof required|Log each hold separately|Most total minutes wins',
     'Iron Core Trophy', '2026-02-19', '2026-02-26', 0),

(4,  'Step Destroyer',         'Most steps in a week. Walk, run, hike — just move.',
     'Screenshot your step tracker daily|Any step-counting device accepted|Most total steps wins',
     'Golden Sneaker Award', '2026-02-26', '2026-03-05', 0),

(5,  'The 5K Challenge',       'Fastest 5K run. Submit your best time with GPS proof.',
     'Strava/Garmin/Apple Watch proof required|One official attempt|Fastest time wins|Treadmill runs accepted with video',
     'Speed Demon Medal', '2026-03-05', '2026-03-12', 0),

(6,  'Perfect Week',           '7 consecutive days of workouts. No misses. Consistency is king.',
     'Any workout counts (30+ min)|Must log each day|Miss a day and you''re out|All survivors share the win',
     'Discipline Badge', '2026-03-12', '2026-03-19', 0),

(7,  'Burpee Bonanza',         'Most burpees in a week. The exercise everyone loves to hate.',
     'Full burpees only (chest to floor, jump at top)|Log daily totals|Video proof for sets over 50',
     'Burpee Beast Title', '2026-03-19', '2026-03-26', 0),

(8,  'Squat Storm',            'Most squats in a week. Build those legs.',
     'Below parallel or it doesn''t count|Weighted squats = 2x reps|Log daily totals',
     'Thunder Thighs Trophy', '2026-03-26', '2026-04-02', 0),

(9,  'Pull-Up Showdown',       'Most pull-ups in a week. Dead hang, full extension.',
     'Full range of motion required|Chin over bar|Assisted pull-ups count as 0.5|Video proof for sets over 20',
     'Iron Grip Award', '2026-04-02', '2026-04-09', 0),

(10, 'Cardio Crusher',         'Most total cardio minutes. Run, bike, swim, row — anything that gets the heart pumping.',
     'Must maintain elevated heart rate|Log each session with duration|Any cardio modality counts',
     'Cardio King/Queen Crown', '2026-04-09', '2026-04-16', 0),

(11, 'Wall Sit Warriors',      'Longest cumulative wall sit time. Backs against the wall.',
     'Thighs parallel to ground|Timer proof required|Log each hold separately|Most total seconds wins',
     'Wall of Steel Medal', '2026-04-16', '2026-04-23', 0),

(12, 'Lunge Gauntlet',         'Most lunges in a week. Walking, stationary, or jumping — all count.',
     'Knee must touch or nearly touch ground|Each leg = 1 rep|Weighted lunges = 1.5x reps',
     'Lunge Legend Status', '2026-04-23', '2026-04-30', 0),

(13, 'Mountain Climber Madness','Most mountain climbers in a week. Fast feet, strong core.',
     'Each leg forward = 1 rep|Log daily totals|Video proof for sets over 100',
     'Summit Slayer Trophy', '2026-04-30', '2026-05-07', 0),

(14, 'Rowing Rampage',         'Most meters rowed (or calories on any cardio machine). Machine warfare.',
     'Rower, bike, elliptical all count|Log machine readout with photo|Most total distance/cals wins',
     'Machine Master Medal', '2026-05-07', '2026-05-14', 0),

(15, 'Ab Annihilator',         'Most ab exercises in a week. Crunches, sit-ups, leg raises — build that six-pack.',
     'Any ab exercise counts|Each rep = 1 point|Planks: 1 second = 1 point|Log daily totals',
     'Six-Pack Starter Kit', '2026-05-14', '2026-05-21', 0),

(16, 'Double Down Week',       'Two-a-day workouts for as many days as possible. Morning and evening sessions.',
     'Each workout must be 20+ min|Both sessions logged separately|Max 7 days = 14 sessions|Most sessions wins',
     'Double Threat Badge', '2026-05-21', '2026-05-28', 0),

(17, 'Final Push',             'Total workout minutes for the last week. Leave it all on the floor before the Fiji reveal.',
     'Any workout counts|Log every minute|Quality over quantity encouraged|Most total minutes wins',
     'Pre-Fiji Champion Belt', '2026-05-28', '2026-06-04', 0);
