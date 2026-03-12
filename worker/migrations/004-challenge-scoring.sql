-- Add scoring direction and label to challenges
-- lower_is_better: 1 for time-based challenges where fastest wins (e.g. 5K run)
-- score_label: display unit for scores (reps, min, sec, steps, etc.)

ALTER TABLE challenges ADD COLUMN lower_is_better INTEGER DEFAULT 0;
ALTER TABLE challenges ADD COLUMN score_label TEXT DEFAULT 'reps';

-- Set correct labels and scoring direction for existing challenges
UPDATE challenges SET score_label = 'reps'    WHERE week_number IN (1, 2, 7, 8, 9, 12, 13, 15);
UPDATE challenges SET score_label = 'min'     WHERE week_number IN (3, 10, 17);
UPDATE challenges SET score_label = 'steps'   WHERE week_number = 4;
UPDATE challenges SET score_label = 'min', lower_is_better = 1 WHERE week_number = 5;
UPDATE challenges SET score_label = 'days'    WHERE week_number = 6;
UPDATE challenges SET score_label = 'sec'     WHERE week_number = 11;
UPDATE challenges SET score_label = 'sessions' WHERE week_number = 16;
UPDATE challenges SET score_label = 'cals'    WHERE week_number = 14;
