import { useState, useEffect } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { COLORS, RADIUS, SHADOW } from '@/theme';

function getFollowing(): string[] {
  try { return JSON.parse(localStorage.getItem('soukpro_following') || '[]'); }
  catch { return []; }
}
function saveFollowing(ids: string[]) {
  try { localStorage.setItem('soukpro_following', JSON.stringify(ids)); } catch {}
}
function getFollowerCount(userId: string): number {
  try {
    const counts = JSON.parse(localStorage.getItem('soukpro_follower_counts') || '{}') as Record<string, number>;
    if (counts[userId] !== undefined) return counts[userId];
    // stable seed from userId chars
    const seed = userId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return (seed % 190) + 10;
  } catch { return 12; }
}
function setFollowerCount(userId: string, count: number) {
  try {
    const counts = JSON.parse(localStorage.getItem('soukpro_follower_counts') || '{}') as Record<string, number>;
    counts[userId] = count;
    localStorage.setItem('soukpro_follower_counts', JSON.stringify(counts));
  } catch {}
}

interface FollowButtonProps {
  targetUserId?: string | null;
  currentUserId?: string | null;
  compact?: boolean;
}

export function FollowButton({ targetUserId, currentUserId, compact = false }: FollowButtonProps) {
  const [following, setFollowing] = useState<string[]>([]);
  const [followerCount, setFollowerCountState] = useState(0);

  useEffect(() => {
    if (!targetUserId) return;
    setFollowing(getFollowing());
    setFollowerCountState(getFollowerCount(targetUserId));
  }, [targetUserId]);

  // Don't render if no target or same user
  if (!targetUserId) return null;
  if (currentUserId && currentUserId === targetUserId) return null;

  const isFollowing = following.includes(targetUserId);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId || !targetUserId) return;
    const updated = isFollowing
      ? following.filter(id => id !== targetUserId)
      : [...following, targetUserId];
    const newCount = followerCount + (isFollowing ? -1 : 1);
    saveFollowing(updated);
    setFollowerCount(targetUserId, newCount);
    setFollowing(updated);
    setFollowerCountState(newCount);
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        style={{
          fontSize: 11, fontWeight: 800, padding: '4px 10px',
          borderRadius: RADIUS.full,
          cursor: currentUserId ? 'pointer' : 'default',
          background: isFollowing ? COLORS.cardAlt : COLORS.primary,
          color: isFollowing ? COLORS.textSecondary : '#fff',
          border: isFollowing ? `1.5px solid ${COLORS.border}` : 'none',
          transition: 'all 0.2s', flexShrink: 0,
        }}
      >
        {isFollowing ? 'متابَع' : 'متابعة'}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', borderRadius: RADIUS.lg,
        background: isFollowing ? COLORS.cardAlt : COLORS.primary,
        color: isFollowing ? COLORS.textSecondary : '#fff',
        border: isFollowing ? `1.5px solid ${COLORS.border}` : 'none',
        fontSize: 13, fontWeight: 800,
        cursor: currentUserId ? 'pointer' : 'default',
        boxShadow: isFollowing ? 'none' : SHADOW.primary,
        transition: 'all 0.2s', flexShrink: 0,
      }}
      onMouseEnter={e => { if (currentUserId) e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
    >
      {isFollowing
        ? <><UserMinus size={14} /> إلغاء المتابعة</>
        : <><UserPlus size={14} /> متابعة</>
      }
    </button>
  );
}

interface FollowStatsProps {
  userId?: string | null;
  onWhite?: boolean;
}

export function FollowStats({ userId, onWhite = true }: FollowStatsProps) {
  const [followers, setFollowers] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    setFollowers(getFollowerCount(userId));
    setFollowingCount(getFollowing().length);
  }, [userId]);

  if (!userId) return null;

  const numColor = onWhite ? COLORS.textPrimary : '#fff';
  const lblColor = onWhite ? COLORS.textTertiary : 'rgba(255,255,255,0.75)';

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: numColor }}>
          {followers >= 1000 ? `${(followers / 1000).toFixed(1)}k` : followers}
        </span>
        <span style={{ fontSize: 11, color: lblColor, fontWeight: 600 }}>متابِع</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: numColor }}>{followingCount}</span>
        <span style={{ fontSize: 11, color: lblColor, fontWeight: 600 }}>متابَع</span>
      </div>
    </div>
  );
}
