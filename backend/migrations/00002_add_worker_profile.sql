-- +goose Up
-- +goose StatementBegin
CREATE TABLE worker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[] NOT NULL,
    hourly_rate NUMERIC(10,2),

    completed_jobs INT DEFAULT 0,
    avg_rating NUMERIC(2,1) DEFAULT 0.0,

    verification_level VARCHAR(20) DEFAULT 'new'
        CHECK (verification_level IN ('new', 'trusted', 'verified')),

    created_at TIMESTAMP DEFAULT NOW()
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS worker_profiles;
-- +goose StatementEnd
