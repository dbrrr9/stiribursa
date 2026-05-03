import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export function useSavedArticles() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!user) { setSavedIds(new Set()); return; }
    const { data } = await supabase
      .from("saved_articles")
      .select("article_id")
      .eq("user_id", user.id);
    if (data) setSavedIds(new Set(data.map((d) => d.article_id)));
  }, [user]);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);

  const toggleSave = useCallback(async (articleId: string, title: string, source: string, summary: string) => {
    if (!user) return;
    setLoading(true);
    try {
      if (savedIds.has(articleId)) {
        await supabase.from("saved_articles").delete().eq("user_id", user.id).eq("article_id", articleId);
        setSavedIds((prev) => { const next = new Set(prev); next.delete(articleId); return next; });
      } else {
        await supabase.from("saved_articles").insert({
          user_id: user.id,
          article_id: articleId,
          article_title: title,
          article_source: source,
          article_summary: summary,
        });
        setSavedIds((prev) => new Set(prev).add(articleId));
      }
    } finally {
      setLoading(false);
    }
  }, [user, savedIds]);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  return { isSaved, toggleSave, loading, savedIds };
}
