-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_workouts INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    start_weight REAL,
    current_weight REAL,
    goal_weight REAL,
    goal_type TEXT DEFAULT 'lose', -- 'lose', 'gain', 'maintain'
    total_points INTEGER DEFAULT 0
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    workout_type TEXT NOT NULL,
    amount TEXT NOT NULL,
    points INTEGER DEFAULT 10,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Weekly challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    week_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    rules TEXT,
    prize TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Challenge entries/scores
CREATE TABLE IF NOT EXISTS challenge_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    proof_url TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(challenge_id, user_id)
);

-- Trash talk/messages
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed initial challenge
INSERT INTO challenges (week_number, name, description, rules, prize, start_date, end_date, is_active) 
VALUES (
    1, 
    'The 1000 Rep Gauntlet',
    '1000 reps total this week. Any exercise counts. Pushups, squats, lunges, crunches, burpees.',
    '100 reps = 10 points on the leaderboard|Must log reps within 24 hours|Video proof for final 100 reps|Winner gets bragging rights + mystery prize|Last place buys winner smoothie',
    'Eternal Glory + Premium protein powder',
    '2026-02-05',
    '2026-02-12',
    1
);
