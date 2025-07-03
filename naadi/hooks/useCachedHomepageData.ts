import { useState, useEffect, useRef } from 'react';
import { useStorageState } from './useStorageState';
import { getRecommendedData, getNewToNaadiData, getTrendingData } from '@naadi/api'; // Adjust the import path as necessary
import { EstablishmentData } from '../../types/index';

interface CachedHomepageData {
  recommended: EstablishmentData[];
  newToNaadi: EstablishmentData[];
  trending: EstablishmentData[];
  timestamp: number;
}

export function useCachedHomepageData(forceRefresh = false) {
  const [[isLoadingStorage, cachedData], setCachedData] = useStorageState('homepageData');

  const [recommendedData, setRecommendedData] = useState<EstablishmentData[]>([]);
  const [newToNaadiData, setNewToNaadiData] = useState<EstablishmentData[]>([]);
  const [trendingData, setTrendingData] = useState<EstablishmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const loadDataCalled = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (cachedData && !forceRefresh) {
        try {
          const parsedData: CachedHomepageData = JSON.parse(cachedData);
          const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

          if (Date.now() - parsedData.timestamp < oneDay) {
            console.log("Using cached homepage data.");
            setRecommendedData(parsedData.recommended);
            setNewToNaadiData(parsedData.newToNaadi);
            setTrendingData(parsedData.trending);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached data, fetching new data.", e);
        }
      }

      console.log("Fetching new homepage data.");
      try {
        setLoading(true);
        const [recommended, newToNaadi, trending] = await Promise.all([
          getRecommendedData(),
          getNewToNaadiData(),
          getTrendingData(),
        ]);

        setRecommendedData(recommended);
        setNewToNaadiData(newToNaadi);
        setTrendingData(trending);

        const dataToCache: CachedHomepageData = {
          recommended,
          newToNaadi,
          trending,
          timestamp: Date.now(),
        };
        setCachedData(JSON.stringify(dataToCache));

      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoadingStorage && !loadDataCalled.current) {
      loadDataCalled.current = true;
      loadData();
    }

    // If forceRefresh changes to true, force a reload
    if (forceRefresh) {
      loadData();
    }

  }, [isLoadingStorage, cachedData, setCachedData, forceRefresh]);

  return { recommendedData, newToNaadiData, trendingData, loading };
}
