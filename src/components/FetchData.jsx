import axios from 'axios';

const FetchData = async (endpoint, token) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL + endpoint}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `niga-token ${token}`
        }
      }
    )
    const data = response.data;

    return data

  } catch (error) {
    console.error('Error on Get data:', error);
    throw error;
  }
};

export default FetchData;