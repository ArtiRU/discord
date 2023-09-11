import { ReactNode, FC } from 'react';

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
