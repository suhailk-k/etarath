import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the User type
import { UserProfile } from '@/services/api/types/user';

// Define the User type
export type User = UserProfile;

// Define the State interface
interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Define the Actions interface
interface UserActions {
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    set => ({

      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: user =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
        }),

      updateUser: updates =>
        set(state => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearUser: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: isLoading => set({ isLoading }),
    }),
    {
      name: 'user-storage', // unique name for the storage key
      storage: createJSONStorage(() => AsyncStorage), // use AsyncStorage
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }), // Only persist user, tokens and auth status
    },
  ),
);

// Selectors for optimized re-renders
export const useUser = () => useUserStore(state => state.user);
export const useTokens = () =>
  useUserStore(state => ({
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  }));
export const useIsAuthenticated = () => useUserStore(state => state.isAuthenticated);
export const useUserActions = () =>
  useUserStore(state => ({
    setUser: state.setUser,
    setTokens: state.setTokens,
    updateUser: state.updateUser,
    clearUser: state.clearUser,
    setLoading: state.setLoading,
  }));

  export const logout = () => {
    useUserStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };
