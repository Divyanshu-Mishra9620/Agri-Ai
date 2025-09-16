import React from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';


export default function PersistAuth({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const authState = localStorage.getItem('authState');
    if (authState) {
      dispatch(setCredentials(JSON.parse(authState)));
    }
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return null; 
  }

  return children;
}