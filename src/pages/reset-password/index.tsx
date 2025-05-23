import React, { useEffect } from 'react'
import { toast } from 'sonner';
import { useApiRequest } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@/features/reset-password';
import { resetPasswordService } from '@/api';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");
  const token = urlParams.get("token");

  const {
    run: runResetPassword, 
    data: ResetPasswordResponse,
    error,
    requestStatus
  } = useApiRequest({});

  const onSubmit = (data: {
    password: string;
  }) => {
    runResetPassword(resetPasswordService({
      uid: uid || '',
      token: token || '',
      new_password: data.password,
    }));
  };

  const homeRoute = () => {
    navigate('/');
  };

  useEffect(() => {
    if (ResetPasswordResponse?.status === 200) {
      toast.success('Password reset successfully');
      navigate('/login')
    } else if (error) {
      toast.error(error?.response?.data?.non_field_errors[0]);
      
    }
  }, [ResetPasswordResponse, error]);

  return (
    <>
      <ResetPasswordUI isLoading={requestStatus.isPending} onSubmit={onSubmit} homeRoute={homeRoute}/>
    </>
  )
}

export { ResetPassword }
