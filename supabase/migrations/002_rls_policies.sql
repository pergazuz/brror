-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view profiles of potential matches"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Location shares policies
CREATE POLICY "Users can view location of matched users only"
  ON location_shares FOR SELECT
  USING (
    enabled = true 
    AND expires_at > NOW()
    AND (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM matches m
        WHERE (m.user1_id = auth.uid() AND m.user2_id = user_id)
           OR (m.user2_id = auth.uid() AND m.user1_id = user_id)
      )
    )
  );

CREATE POLICY "Users can manage their own location share"
  ON location_shares FOR ALL
  USING (auth.uid() = user_id);

-- Swipes policies
CREATE POLICY "Users can view their own swipes"
  ON swipes FOR SELECT
  USING (auth.uid() = swiper_id);

CREATE POLICY "Users can create swipes"
  ON swipes FOR INSERT
  WITH CHECK (auth.uid() = swiper_id);

-- Matches policies
CREATE POLICY "Users can view their own matches"
  ON matches FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can view messages in their matches"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their matches"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their sent messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);

