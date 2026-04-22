-- Reconstructed public schema from backup

-- TABLES
CREATE TABLE public.achievements (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, achievement_type text NOT NULL, title text NOT NULL, description text NOT NULL, icon text NOT NULL, unlocked_at timestamp with time zone, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.astro_profiles (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, name text NOT NULL, birth_date date NOT NULL, birth_time time without time zone, birth_place text, last_reading jsonb, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.audit_logs (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid, action text NOT NULL, table_name text NOT NULL, record_id uuid, old_values jsonb, new_values jsonb, ip_address inet, user_agent text, created_at timestamp with time zone DEFAULT now());
CREATE TABLE public.cached_daily_horoscopes (id uuid DEFAULT gen_random_uuid() NOT NULL, zodiac_sign text NOT NULL, date date NOT NULL, birth_year integer NOT NULL, language text DEFAULT 'ru'::text NOT NULL, content jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.cached_monthly_horoscopes (id uuid DEFAULT gen_random_uuid() NOT NULL, zodiac_sign text NOT NULL, month integer NOT NULL, year integer NOT NULL, birth_year integer NOT NULL, language text DEFAULT 'ru'::text NOT NULL, content jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.cached_yearly_horoscopes (id uuid DEFAULT gen_random_uuid() NOT NULL, zodiac_sign text NOT NULL, target_year integer NOT NULL, birth_year integer NOT NULL, language text DEFAULT 'ru'::text NOT NULL, content jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.cosmic_artifacts (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, artifact_id text NOT NULL, name text NOT NULL, description text NOT NULL, type text NOT NULL, rarity text NOT NULL, effects jsonb DEFAULT '[]'::jsonb NOT NULL, obtained_from_mission text, obtained_at timestamp with time zone DEFAULT now() NOT NULL, is_active boolean DEFAULT false NOT NULL);
CREATE TABLE public.daily_limits (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, date date DEFAULT CURRENT_DATE NOT NULL, universe_questions_count integer DEFAULT 0 NOT NULL, voice_calls_count integer DEFAULT 0 NOT NULL, meditations_count integer DEFAULT 0 NOT NULL, cosmic_missions_count integer DEFAULT 0 NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.daily_reflections (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, mission_id text NOT NULL, day_number integer NOT NULL, question text NOT NULL, answer text NOT NULL, reflection_type text DEFAULT 'text'::text NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, attachment_url text);
CREATE TABLE public.detailed_horoscopes (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, zodiac_sign text NOT NULL, date date NOT NULL, content jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.email_verification_codes (id uuid DEFAULT gen_random_uuid() NOT NULL, email text NOT NULL, code text NOT NULL, expires_at timestamp with time zone NOT NULL, used boolean DEFAULT false NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.full_horoscopes (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, zodiac_sign text NOT NULL, content jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.mission_choices (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, mission_id text NOT NULL, choice_event_id text NOT NULL, choice_id text NOT NULL, consequences jsonb DEFAULT '[]'::jsonb NOT NULL, chosen_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.mission_progress (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, mission_id text NOT NULL, progress jsonb DEFAULT '[]'::jsonb NOT NULL, accepted_at timestamp with time zone DEFAULT now() NOT NULL, last_updated_at timestamp with time zone DEFAULT now() NOT NULL, completed boolean DEFAULT false NOT NULL, completed_at timestamp with time zone);
CREATE TABLE public.mission_progress_detailed (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, mission_id text NOT NULL, day_number integer NOT NULL, completed boolean DEFAULT false NOT NULL, completed_at timestamp with time zone, data jsonb DEFAULT '{}'::jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL, completed_date date);
CREATE TABLE public.missions (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, title text NOT NULL, description text NOT NULL, requirements jsonb NOT NULL, reward jsonb NOT NULL, completed boolean DEFAULT false NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.numerology_descriptions (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, reading_id uuid NOT NULL, description_data jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, language text DEFAULT 'ru'::text NOT NULL);
CREATE TABLE public.numerology_readings (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, birth_date date NOT NULL, name text NOT NULL, matrix_data jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.pact_days (id uuid DEFAULT gen_random_uuid() NOT NULL, pact_id uuid NOT NULL, date date NOT NULL, completed boolean DEFAULT false NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.pacts (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, title text NOT NULL, duration integer NOT NULL, reward text, status text DEFAULT 'active'::text NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, type text DEFAULT 'spiritual'::text, break_reason text);
CREATE TABLE public.profiles (id uuid NOT NULL, name text NOT NULL, birth_date date, total_days integer DEFAULT 0 NOT NULL, energy_points integer DEFAULT 0 NOT NULL, goal text, rank text DEFAULT 'seeker'::text NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL, avatar_url text, active_mission text, profile_step_completed boolean DEFAULT false);
CREATE TABLE public.push_subscriptions (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, subscription jsonb NOT NULL, settings jsonb DEFAULT '{"meditation": true, "pactUpdates": true, "achievements": true, "subscription": true, "dailyReminder": true, "universeMessages": true}'::jsonb NOT NULL, device_info jsonb, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL, is_active boolean DEFAULT true NOT NULL);
CREATE TABLE public.raw_horoscopes (id uuid DEFAULT gen_random_uuid() NOT NULL, zodiac_sign text NOT NULL, language text NOT NULL, content text NOT NULL, detailed boolean DEFAULT false NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.subscriptions (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, is_pro boolean DEFAULT false NOT NULL, subscription_start timestamp with time zone, subscription_end timestamp with time zone, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL, revenuecat_user_id text, platform text DEFAULT 'web'::text, original_transaction_id text, store_transaction_id text, product_id text DEFAULT 'pro_monthly'::text);
CREATE TABLE public.universe_chat_messages (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, content text NOT NULL, sender text NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, session_id uuid, CONSTRAINT universe_chat_messages_sender_check CHECK ((sender = ANY (ARRAY['user'::text, 'universe'::text]))));
CREATE TABLE public.universe_chat_sessions (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, title text NOT NULL, last_message timestamp with time zone DEFAULT now() NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.universe_questions (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, question text NOT NULL, answer text NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public.user_onboarding_state (user_id uuid NOT NULL, profile_step_completed boolean DEFAULT false, onboarding_step_completed boolean DEFAULT false, preferences_step_completed boolean DEFAULT false, current_step text DEFAULT 'profile'::text, completed_at timestamp with time zone, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now());

-- PRIMARY KEYS & UNIQUE CONSTRAINTS
ALTER TABLE ONLY public.achievements ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.astro_profiles ADD CONSTRAINT astro_profiles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.audit_logs ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cached_daily_horoscopes ADD CONSTRAINT cached_daily_horoscopes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cached_daily_horoscopes ADD CONSTRAINT cached_daily_horoscopes_uk UNIQUE (zodiac_sign, date, birth_year, language);
ALTER TABLE ONLY public.cached_monthly_horoscopes ADD CONSTRAINT cached_monthly_horoscopes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cached_monthly_horoscopes ADD CONSTRAINT cached_monthly_horoscopes_uk UNIQUE (zodiac_sign, month, year, birth_year, language);
ALTER TABLE ONLY public.cached_yearly_horoscopes ADD CONSTRAINT cached_yearly_horoscopes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cached_yearly_horoscopes ADD CONSTRAINT cached_yearly_horoscopes_uk UNIQUE (zodiac_sign, target_year, birth_year, language);
ALTER TABLE ONLY public.cosmic_artifacts ADD CONSTRAINT cosmic_artifacts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cosmic_artifacts ADD CONSTRAINT cosmic_artifacts_uk UNIQUE (user_id, artifact_id);
ALTER TABLE ONLY public.daily_limits ADD CONSTRAINT daily_limits_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.daily_limits ADD CONSTRAINT daily_limits_uk UNIQUE (user_id, date);
ALTER TABLE ONLY public.daily_reflections ADD CONSTRAINT daily_reflections_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.daily_reflections ADD CONSTRAINT daily_reflections_uk UNIQUE (user_id, mission_id, day_number);
ALTER TABLE ONLY public.detailed_horoscopes ADD CONSTRAINT detailed_horoscopes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.email_verification_codes ADD CONSTRAINT email_verification_codes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.full_horoscopes ADD CONSTRAINT full_horoscopes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mission_choices ADD CONSTRAINT mission_choices_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mission_choices ADD CONSTRAINT mission_choices_uk UNIQUE (user_id, mission_id, choice_event_id);
ALTER TABLE ONLY public.mission_progress_detailed ADD CONSTRAINT mission_progress_detailed_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mission_progress_detailed ADD CONSTRAINT mission_progress_detailed_uk UNIQUE (user_id, mission_id, day_number);
ALTER TABLE ONLY public.mission_progress ADD CONSTRAINT mission_progress_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mission_progress ADD CONSTRAINT mission_progress_uk UNIQUE (user_id, mission_id);
ALTER TABLE ONLY public.missions ADD CONSTRAINT missions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.numerology_descriptions ADD CONSTRAINT numerology_descriptions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.numerology_readings ADD CONSTRAINT numerology_readings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.numerology_readings ADD CONSTRAINT numerology_readings_uk UNIQUE (user_id, birth_date, name);
ALTER TABLE ONLY public.pact_days ADD CONSTRAINT pact_days_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pacts ADD CONSTRAINT pacts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.push_subscriptions ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.raw_horoscopes ADD CONSTRAINT raw_horoscopes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.subscriptions ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.universe_chat_messages ADD CONSTRAINT universe_chat_messages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.universe_chat_sessions ADD CONSTRAINT universe_chat_sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.universe_questions ADD CONSTRAINT universe_questions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_onboarding_state ADD CONSTRAINT user_onboarding_state_pkey PRIMARY KEY (user_id);

-- FOREIGN KEYS
ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.pact_days ADD CONSTRAINT pact_days_pact_id_fkey FOREIGN KEY (pact_id) REFERENCES public.pacts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.numerology_descriptions ADD CONSTRAINT numerology_descriptions_reading_id_fkey FOREIGN KEY (reading_id) REFERENCES public.numerology_readings(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_onboarding_state ADD CONSTRAINT user_onboarding_state_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.universe_chat_messages ADD CONSTRAINT universe_chat_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.universe_chat_sessions(id) ON DELETE CASCADE;

-- ENABLE RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cached_daily_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cached_monthly_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cached_yearly_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosmic_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detailed_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.full_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_progress_detailed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.numerology_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.numerology_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pact_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding_state ENABLE ROW LEVEL SECURITY;

-- INDEXES
CREATE INDEX idx_achievements_user_id_unlocked ON public.achievements (user_id, unlocked_at);
CREATE INDEX idx_astro_profiles_user ON public.astro_profiles (user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX idx_cached_daily_horoscopes_lookup ON public.cached_daily_horoscopes (zodiac_sign, date, birth_year, language);
CREATE INDEX idx_cached_monthly_horoscopes_lookup ON public.cached_monthly_horoscopes (zodiac_sign, month, year, birth_year, language);
CREATE INDEX idx_cached_yearly_horoscopes_lookup ON public.cached_yearly_horoscopes (zodiac_sign, target_year, birth_year, language);
CREATE INDEX idx_cosmic_artifacts_user_id ON public.cosmic_artifacts (user_id);
CREATE INDEX idx_daily_limits_user_date ON public.daily_limits (user_id, date);
CREATE INDEX idx_daily_reflections_user ON public.daily_reflections (user_id);
CREATE INDEX idx_detailed_horoscopes_user_date ON public.detailed_horoscopes (user_id, date);
CREATE INDEX idx_email_verification_codes_email_code ON public.email_verification_codes (email, code);
CREATE INDEX idx_email_verification_codes_expires_at ON public.email_verification_codes (expires_at);
CREATE INDEX idx_full_horoscopes_user ON public.full_horoscopes (user_id);
CREATE INDEX idx_mission_choices_user_mission ON public.mission_choices (user_id, mission_id);
CREATE INDEX idx_mission_progress_detailed_user_completed ON public.mission_progress_detailed (user_id, completed);
CREATE INDEX idx_mission_progress_user_completed ON public.mission_progress (user_id, completed);
CREATE INDEX idx_missions_user_id ON public.missions (user_id);
CREATE INDEX idx_numerology_descriptions_user_reading ON public.numerology_descriptions (user_id, reading_id);
CREATE INDEX idx_numerology_readings_user ON public.numerology_readings (user_id);
CREATE INDEX idx_pact_days_pact_id_completed ON public.pact_days (pact_id, completed);
CREATE INDEX idx_pact_days_date ON public.pact_days (date);
CREATE INDEX idx_pacts_user_id_status ON public.pacts (user_id, status);
CREATE INDEX idx_profiles_completion ON public.profiles (birth_date, name) WHERE birth_date IS NOT NULL AND name IS NOT NULL;
CREATE INDEX idx_profiles_energy_points ON public.profiles (energy_points);
CREATE INDEX idx_profiles_total_days ON public.profiles (total_days);
CREATE INDEX idx_push_subscriptions_active ON public.push_subscriptions (is_active) WHERE is_active = true;
CREATE INDEX idx_push_subscriptions_user_id ON public.push_subscriptions (user_id);
CREATE INDEX idx_subscriptions_user ON public.subscriptions (user_id);
CREATE INDEX idx_universe_chat_messages_user_session ON public.universe_chat_messages (user_id, session_id);
CREATE INDEX idx_universe_chat_sessions_user ON public.universe_chat_sessions (user_id);
CREATE INDEX idx_universe_questions_user_created ON public.universe_questions (user_id, created_at);
CREATE INDEX idx_user_onboarding_state_step ON public.user_onboarding_state (current_step, profile_step_completed);

-- FUNCTIONS
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  INSERT INTO public.profiles (id, name) VALUES (new.id, 'Искатель');
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION public.create_verification_code(p_email text, p_code text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE code_id uuid;
BEGIN
  DELETE FROM public.email_verification_codes WHERE email = p_email;
  INSERT INTO public.email_verification_codes (email, code, expires_at)
  VALUES (p_email, p_code, now() + interval '15 minutes') RETURNING id INTO code_id;
  RETURN code_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_verification_code(p_email text, p_code text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE is_valid boolean := false;
BEGIN
  DELETE FROM public.email_verification_codes WHERE expires_at <= now();
  UPDATE public.email_verification_codes SET used = true
  WHERE email = p_email AND code = p_code AND expires_at > now() AND used = false
  RETURNING true INTO is_valid;
  RETURN COALESCE(is_valid, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.batch_delete_user_data(target_user_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  DELETE FROM public.pact_days WHERE pact_id IN (SELECT id FROM public.pacts WHERE user_id = target_user_id);
  DELETE FROM public.achievements WHERE user_id = target_user_id;
  DELETE FROM public.pacts WHERE user_id = target_user_id;
  DELETE FROM public.universe_questions WHERE user_id = target_user_id;
  DELETE FROM public.universe_chat_messages WHERE user_id = target_user_id;
  DELETE FROM public.universe_chat_sessions WHERE user_id = target_user_id;
  DELETE FROM public.missions WHERE user_id = target_user_id;
  DELETE FROM public.mission_progress WHERE user_id = target_user_id;
  DELETE FROM public.mission_progress_detailed WHERE user_id = target_user_id;
  DELETE FROM public.daily_reflections WHERE user_id = target_user_id;
  DELETE FROM public.mission_choices WHERE user_id = target_user_id;
  DELETE FROM public.cosmic_artifacts WHERE user_id = target_user_id;
  DELETE FROM public.detailed_horoscopes WHERE user_id = target_user_id;
  DELETE FROM public.full_horoscopes WHERE user_id = target_user_id;
  DELETE FROM public.astro_profiles WHERE user_id = target_user_id;
  DELETE FROM public.numerology_descriptions WHERE user_id = target_user_id;
  DELETE FROM public.numerology_readings WHERE user_id = target_user_id;
  DELETE FROM public.push_subscriptions WHERE user_id = target_user_id;
  DELETE FROM public.subscriptions WHERE user_id = target_user_id;
  DELETE FROM public.daily_limits WHERE user_id = target_user_id;
  DELETE FROM public.user_onboarding_state WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
END;
$$;

-- TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_astro_profiles_updated_at BEFORE UPDATE ON public.astro_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_numerology_readings_updated_at BEFORE UPDATE ON public.numerology_readings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_onboarding_state_updated_at BEFORE UPDATE ON public.user_onboarding_state FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON public.push_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mission_progress_detailed_updated_at BEFORE UPDATE ON public.mission_progress_detailed FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_limits_updated_at BEFORE UPDATE ON public.daily_limits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- POLICIES: profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- POLICIES: pacts
CREATE POLICY "Users can view their own pacts" ON public.pacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own pacts" ON public.pacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pacts" ON public.pacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pacts" ON public.pacts FOR DELETE USING (auth.uid() = user_id);

-- POLICIES: pact_days (via pact ownership)
CREATE POLICY "Users can view their pact days" ON public.pact_days FOR SELECT USING (pact_id IN (SELECT id FROM public.pacts WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert their pact days" ON public.pact_days FOR INSERT WITH CHECK (pact_id IN (SELECT id FROM public.pacts WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their pact days" ON public.pact_days FOR UPDATE USING (pact_id IN (SELECT id FROM public.pacts WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete their pact days" ON public.pact_days FOR DELETE USING (pact_id IN (SELECT id FROM public.pacts WHERE user_id = auth.uid()));

-- POLICIES: missions
CREATE POLICY "Users can view their own missions" ON public.missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own missions" ON public.missions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own missions" ON public.missions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own missions" ON public.missions FOR DELETE USING (auth.uid() = user_id);

-- POLICIES: mission_progress
CREATE POLICY "Users can view their mission progress" ON public.mission_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their mission progress" ON public.mission_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their mission progress" ON public.mission_progress FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES: mission_progress_detailed
CREATE POLICY "Users can view detailed progress" ON public.mission_progress_detailed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert detailed progress" ON public.mission_progress_detailed FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update detailed progress" ON public.mission_progress_detailed FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES: mission_choices
CREATE POLICY "Users can view their choices" ON public.mission_choices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their choices" ON public.mission_choices FOR INSERT WITH CHECK (auth.uid() = user_id);

-- POLICIES: daily_reflections
CREATE POLICY "Users can view their reflections" ON public.daily_reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their reflections" ON public.daily_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their reflections" ON public.daily_reflections FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES: achievements
CREATE POLICY "Users can view their achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their achievements" ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their achievements" ON public.achievements FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES: cosmic_artifacts
CREATE POLICY "Users can view their artifacts" ON public.cosmic_artifacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their artifacts" ON public.cosmic_artifacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their artifacts" ON public.cosmic_artifacts FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES: subscriptions
CREATE POLICY "Users can view their subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their subscription" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES: daily_limits
CREATE POLICY "Users can view their limits" ON public.daily_limits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their limits" ON public.daily_limits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their limits" ON public.daily_limits FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES: universe_chat_sessions / messages / questions
CREATE POLICY "Users can view their sessions" ON public.universe_chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their sessions" ON public.universe_chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their sessions" ON public.universe_chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their sessions" ON public.universe_chat_sessions FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their messages" ON public.universe_chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their messages" ON public.universe_chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their questions" ON public.universe_questions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their questions" ON public.universe_questions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- POLICIES: horoscopes (personal)
CREATE POLICY "Users can view their detailed horoscopes" ON public.detailed_horoscopes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their detailed horoscopes" ON public.detailed_horoscopes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their full horoscopes" ON public.full_horoscopes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their full horoscopes" ON public.full_horoscopes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- POLICIES: cached horoscopes (read for any authenticated user; insert via service role only)
CREATE POLICY "Authenticated can read daily cache" ON public.cached_daily_horoscopes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can read monthly cache" ON public.cached_monthly_horoscopes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can read yearly cache" ON public.cached_yearly_horoscopes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can read raw horoscopes" ON public.raw_horoscopes FOR SELECT USING (auth.uid() IS NOT NULL);

-- POLICIES: numerology
CREATE POLICY "Users can view their readings" ON public.numerology_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their readings" ON public.numerology_readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their readings" ON public.numerology_readings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their descriptions" ON public.numerology_descriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their descriptions" ON public.numerology_descriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- POLICIES: astro_profiles
CREATE POLICY "Users can view their astro profile" ON public.astro_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their astro profile" ON public.astro_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their astro profile" ON public.astro_profiles FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES: push_subscriptions
CREATE POLICY "Users can view their push subscriptions" ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their push subscriptions" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their push subscriptions" ON public.push_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their push subscriptions" ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- POLICIES: user_onboarding_state
CREATE POLICY "Users can view their onboarding state" ON public.user_onboarding_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their onboarding state" ON public.user_onboarding_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their onboarding state" ON public.user_onboarding_state FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES: email_verification_codes (service-only via SECURITY DEFINER funcs)
CREATE POLICY "Users can view only their own codes" ON public.email_verification_codes FOR SELECT USING (auth.email() = email AND expires_at > now() AND used = false);

-- POLICIES: audit_logs (read own only)
CREATE POLICY "Users can view their audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

-- STORAGE BUCKET: avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);