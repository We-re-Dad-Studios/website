//mock data
"use client";
import { useEffect, useState } from 'react'
import axios from 'axios'

export type TMockData = {
    data: any;
    error: any;
    loading: Boolean;
}

type MDataType = 'manga' | 'novels' | 'anime'

export const useFetchMockData = (pgSize: number, page: number, type: MDataType): TMockData => {
    const [data, setData] = useState<any>()
    const [error, setError] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true);
        setError(undefined);

        const getMockData = async () => {
            try {
                const response = await axios.request({
                    method: 'GET',
                    url: `https://anime-manga-and-novels-api.p.rapidapi.com/${type}`,
                    params: { pageSize: pgSize, page },
                    headers: {
                        'x-rapidapi-key': 'b9b50778b2mshf56a76cd487599ep198175jsn56d22ad12345',
                        'x-rapidapi-host': 'anime-manga-and-novels-api.p.rapidapi.com'
                    }
                });
                setData(response.data);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getMockData();
    }, [type, pgSize, page]);

    return { data, error, loading }
}

export default useFetchMockData
