-- +goose Up
-- +goose StatementBegin
CREATE TABLE worker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[] NOT NULL,
    baseRate NUMERIC(10,2),

    completedJobs INT DEFAULT 0,
    avgRating NUMERIC(2,1) DEFAULT 0.0,

    verificationLevel VARCHAR(20) DEFAULT 'new'
        CHECK (verificationLevel IN ('new', 'trusted', 'verified')),

    createdAt TIMESTAMP DEFAULT NOW()
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS worker_profiles;
-- +goose StatementEnd
