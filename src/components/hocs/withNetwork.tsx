import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'rsuite';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

const withNetwork = (Comp: React.ComponentType<any>) => {    
    const WithNetwork: FC = () => {        
        const navigate = useNavigate();
        const authState = useAppSelector((state) => state.authReducer);
        const dispatch = useAppDispatch();

        // Sử dụng useEffect để điều hướng khi trạng thái xác thực thay đổi
        useEffect(() => {
            if (authState.isLoading) {
                return; // Nếu đang tải, không làm gì thêm
            }

            if (!authState.isAuth) {
                navigate('/login'); // điều hướng đến trang đăng nhập
            }
        }, [authState.isLoading, authState.isAuth, navigate]);

        // Kiểm tra trạng thái đang tải
        // if (authState.isLoading) {
        //     return <Loader center content="Đang xử lý..." />;
        // }

        return <Comp authState={authState} dispatch={dispatch} />;
    };

    return WithNetwork;
};

export default withNetwork;
