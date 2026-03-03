CREATE OR REPLACE FUNCTION fn_create_user(
  p_name TEXT, 
  p_email TEXT, 
  p_phone_number TEXT,
  p_emergency_phone_number TEXT,
  p_application_status TEXT,
  p_application_message TEXT,
  p_is_admin BOOLEAN,
  p_is_resident BOOLEAN,
  p_is_security BOOLEAN
)
RETURNS UUID 
SECURITY DEFINER -- Ensures it has permission to write to the users table
LANGUAGE plpgsql AS $$
DECLARE
  new_user_id UUID;
BEGIN
    -- Get the ID from the current authenticated session
    new_user_id := auth.uid();

    -- Validation: Ensure we actually have a session
    IF new_user_id IS NULL THEN
        RAISE EXCEPTION 'No se pudo obtener el ID del usuario autenticado.';
    END IF;

    INSERT INTO users (id, name, email, phone_number, emergency_phone_number, application_status, application_message, is_admin, is_resident, is_security)
    VALUES (new_user_id, p_name, p_email, p_phone_number, p_emergency_phone_number, p_application_status, p_application_message, p_is_admin, p_is_resident, p_is_security)
    RETURNING id INTO new_user_id;

    RETURN new_user_id;
END;
$$;