import { useCallback, useEffect, useState } from "react";
import { api } from "../api/axios";

// fungsi berawalan "use" yang membungkus state + effect supaya bisa dipakai ulang.
export const useOrganizationData = (id) => {
  const [data, setData] = useState({ org: null, projects: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const [orgRes, projectRes, taskRes] = await Promise.all([
        api.get(`/organizations/${id}`),
        api.get(`/projects/organization/${id}`),
        api.get(`/onboardingTask/organization/${id}`),
      ]);
      setData({ org: orgRes.data, projects: projectRes.data, tasks: taskRes.data });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...data, loading, error, reload };
};