CREATE TABLE users(
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    community_id UUID NULL REFERENCES  communities(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
    name text NOT NULL,
    phone_number text NOT NULL,
    emergency_phone_number text NULL,
    email text NOT NULL,
    application_status TEXT NOT NULL CHECK (application_status IN ('pending_approval', 'approved', 'rejected')),
    application_message TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL,
    is_resident BOOLEAN NOT NULL,
    is_security BOOLEAN NOT NULL,
    UNIQUE (id, community_id)
);