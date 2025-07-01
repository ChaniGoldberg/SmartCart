import { renderHook, act } from '@testing-library/react';
import { useUserLocation } from './useUserLocation';
describe('useLocation', () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
  };

  beforeEach(() => {
    // @ts-ignore
    global.navigator.geolocation = mockGeolocation;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return location when geolocation succeeds', async () => {
    const mockPosition = {
      coords: {
        latitude: 32.0853,
        longitude: 34.7818,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success(mockPosition)
    );

    const { result } = renderHook(() => useUserLocation());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      latitude: 32.0853,
      longitude: 34.7818,
      error: null,
      loading: false,
    });
  });

  it('should handle geolocation error', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((_, error) =>
      error({ message: 'User denied Geolocation' })
    );

    const { result } = renderHook(() => useUserLocation());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      latitude: null,
      longitude: null,
      error: 'User denied Geolocation',
      loading: false,
    });
  });

  it('should handle geolocation not supported', async () => {
    // @ts-ignore
    delete global.navigator.geolocation;

    const { result } = renderHook(() => useUserLocation());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      latitude: null,
      longitude: null,
      error: 'Geolocation not supported',
      loading: false,
    });
  });
});
