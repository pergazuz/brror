-- Function to create a match when two users swipe right on each other
CREATE OR REPLACE FUNCTION create_match_on_mutual_swipe()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if this is a right swipe or super like
  IF NEW.direction IN ('right', 'super') THEN
    -- Check if the other user also swiped right
    IF EXISTS (
      SELECT 1 FROM swipes
      WHERE swiper_id = NEW.swiped_id
        AND swiped_id = NEW.swiper_id
        AND direction IN ('right', 'super')
    ) THEN
      -- Create a match (ensure user1_id < user2_id for uniqueness)
      INSERT INTO matches (user1_id, user2_id)
      VALUES (
        LEAST(NEW.swiper_id, NEW.swiped_id),
        GREATEST(NEW.swiper_id, NEW.swiped_id)
      )
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create matches
CREATE TRIGGER on_swipe_create_match
  AFTER INSERT ON swipes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_swipe();

-- Function to get potential matches for a user
CREATE OR REPLACE FUNCTION get_potential_matches(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  profile_id UUID,
  user_id UUID,
  name VARCHAR,
  bio TEXT,
  birth_date DATE,
  gender VARCHAR,
  photos TEXT[],
  interests TEXT[],
  distance_km DOUBLE PRECISION
) AS $$
DECLARE
  v_user_profile RECORD;
  v_user_location RECORD;
BEGIN
  -- Get current user's profile and preferences
  SELECT * INTO v_user_profile
  FROM profiles
  WHERE profiles.user_id = p_user_id;
  
  -- Get current user's location if available
  SELECT * INTO v_user_location
  FROM location_shares
  WHERE location_shares.user_id = p_user_id
    AND enabled = true
    AND expires_at > NOW();
  
  -- Return potential matches
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.name,
    p.bio,
    p.birth_date,
    p.gender,
    p.photos,
    p.interests,
    CASE 
      WHEN v_user_location.location IS NOT NULL AND ls.location IS NOT NULL
      THEN ST_Distance(v_user_location.location, ls.location) / 1000
      ELSE NULL
    END as distance_km
  FROM profiles p
  LEFT JOIN location_shares ls ON ls.user_id = p.user_id 
    AND ls.enabled = true 
    AND ls.expires_at > NOW()
  WHERE p.user_id != p_user_id
    -- Match gender preferences
    AND (
      (v_user_profile.interested_in = 'everyone')
      OR (v_user_profile.interested_in = p.gender)
    )
    AND (
      (p.interested_in = 'everyone')
      OR (p.interested_in = v_user_profile.gender)
    )
    -- Match age preferences
    AND EXTRACT(YEAR FROM AGE(p.birth_date)) BETWEEN v_user_profile.age_min AND v_user_profile.age_max
    AND EXTRACT(YEAR FROM AGE(v_user_profile.birth_date)) BETWEEN p.age_min AND p.age_max
    -- Exclude already swiped profiles
    AND NOT EXISTS (
      SELECT 1 FROM swipes s
      WHERE s.swiper_id = p_user_id
        AND s.swiped_id = p.user_id
    )
    -- Exclude already matched profiles
    AND NOT EXISTS (
      SELECT 1 FROM matches m
      WHERE (m.user1_id = p_user_id AND m.user2_id = p.user_id)
         OR (m.user2_id = p_user_id AND m.user1_id = p.user_id)
    )
    -- Distance filter (if both users have location enabled)
    AND (
      v_user_location.location IS NULL
      OR ls.location IS NULL
      OR ST_Distance(v_user_location.location, ls.location) / 1000 <= v_user_profile.max_distance
    )
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired location shares
CREATE OR REPLACE FUNCTION cleanup_expired_locations()
RETURNS void AS $$
BEGIN
  UPDATE location_shares
  SET enabled = false
  WHERE expires_at <= NOW() AND enabled = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

