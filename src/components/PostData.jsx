import axios from 'axios';

const PostData = async (endpoint, data, token) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL + endpoint}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error('Error on Post data:', error);
    throw error;
  }
};

export default PostData;
