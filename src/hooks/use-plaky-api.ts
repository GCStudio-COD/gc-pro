import { useState, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { Workspace, Space, Board, BoardGroup, PlakyTask } from '@/schemas/plaky';
import { useAuthStore } from '@/store/use-auth-store';
import { usePathname } from 'next/navigation';

export function usePlakyApi() {
  const [loading, setLoading] = useState(false);
  const { userId, role } = useAuthStore();
  const pathname = usePathname();
  
  let effectiveRole = role;
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin';
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager';
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee';

  const getWorkspaces = useCallback(async (): Promise<Workspace[]> => {
    setLoading(true);
    try {
      const res = await fetchApi('/plaky/workspaces');
      if (res.ok) return await res.json();
      throw new Error('Failed to fetch workspaces');
    } catch (e: any) {
      toast.error(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkspace = useCallback(async (name: string): Promise<Workspace | null> => {
    setLoading(true);
    try {
      const res = await fetchApi('/plaky/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      if (res.ok) return await res.json();
      throw new Error('Failed to create workspace');
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSpaces = useCallback(async (): Promise<Space[]> => {
    setLoading(true);
    try {
      const res = await fetchApi(`/plaky/spaces?employeeId=${userId}&role=${effectiveRole}`);
      if (res.ok) return await res.json();
      throw new Error('Failed to fetch spaces');
    } catch (e: any) {
      toast.error(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId, effectiveRole]);

  const createSpace = useCallback(async (data: Partial<Space>): Promise<Space | null> => {
    setLoading(true);
    try {
      const res = await fetchApi('/plaky/spaces', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Space created');
        return await res.json();
      }
      throw new Error('Failed to create space');
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSpace = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetchApi(`/plaky/spaces/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Space deleted');
        return true;
      }
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete space');
    } catch (e: any) {
      toast.error(e.message);
      return false;
    }
  }, []);

  const getBoards = useCallback(async (): Promise<Board[]> => {
    setLoading(true);
    try {
      const res = await fetchApi(`/plaky/boards?employeeId=${userId}&role=${effectiveRole}`);
      if (res.ok) return await res.json();
      throw new Error('Failed to fetch boards');
    } catch (e: any) {
      toast.error(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId, effectiveRole]);

  const getBoard = useCallback(async (id: string): Promise<Board | null> => {
    setLoading(true);
    try {
      const res = await fetchApi(`/plaky/boards/${id}?employeeId=${userId}&role=${effectiveRole}`);
      if (res.ok) return await res.json();
      throw new Error('Failed to fetch board');
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, effectiveRole]);

  const createBoard = useCallback(async (data: Partial<Board>): Promise<Board | null> => {
    setLoading(true);
    try {
      const res = await fetchApi('/plaky/boards', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Board created');
        return await res.json();
      }
      throw new Error('Failed to create board');
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBoard = useCallback(async (id: string, data: Partial<Board>): Promise<Board | null> => {
    try {
      const res = await fetchApi(`/plaky/boards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      throw new Error('Failed to update board');
    } catch (e: any) {
      toast.error(e.message);
      return null;
    }
  }, []);

  const createGroup = useCallback(async (data: Partial<BoardGroup>): Promise<BoardGroup | null> => {
    setLoading(true);
    try {
      const res = await fetchApi('/plaky/groups', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      throw new Error('Failed to create group');
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: Partial<PlakyTask>): Promise<PlakyTask | null> => {
    setLoading(true);
    try {
      const res = await fetchApi('/plaky/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Task created');
        return await res.json();
      }
      throw new Error('Failed to create task');
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<PlakyTask>): Promise<PlakyTask | null> => {
    try {
      const res = await fetchApi(`/plaky/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      throw new Error('Failed to update task');
    } catch (e: any) {
      toast.error(e.message);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetchApi(`/plaky/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Task deleted');
        return true;
      }
      throw new Error('Failed to delete task');
    } catch (e: any) {
      toast.error(e.message);
      return false;
    }
  }, []);
  const deleteBoard = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetchApi(`/plaky/boards/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Board deleted');
        return true;
      }
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete board');
    } catch (e: any) {
      toast.error(e.message);
      return false;
    }
  }, []);

  return {
    loading,
    getWorkspaces,
    createWorkspace,
    getSpaces,
    createSpace,
    deleteSpace,
    getBoards,
    getBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    createGroup,
    createTask,
    updateTask,
    deleteTask,
  };
}
