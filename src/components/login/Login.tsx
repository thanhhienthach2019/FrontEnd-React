import React, { FC, useEffect, useState, useRef, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IAuthDto } from '../../interfaces/IAuthDto'
import { ITwoFactorLogin } from '../../interfaces/ITwoFactorLoginDto'
import { WithNetworkProps } from '../../interfaces/WithNetworkProps'
import { signIn } from '../../store/action-creators/AuthActionCreators'
import { twoFactorLog } from '../../store/action-creators/AuthActionCreators'
import { authActions } from '../../store/reducers/AuthReducer'
import './Login.css';
import withNetwork from '../hocs/withNetwork'
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Container, Content, Footer, Form, Button, Panel, InputGroup, Stack, VStack, Message, Divider, Loader } from 'rsuite';
import { FaRegEye, FaRegEyeSlash, FaGoogle } from 'react-icons/fa';
import { ToastUtils } from '../../utils/ToastUtils';

const Login: FC<WithNetworkProps> = ({ authState, dispatch }: WithNetworkProps) => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigate = useNavigate();
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [message, setMessage] = useState({ content: '', type: '' });
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [expiryTime, setExpiryTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFactorLogin, setisFactorLogin] = useState(false);
    const remainingTimeRef = useRef(remainingTime);
    const requiresTwoFactorRef = useRef(requiresTwoFactor);

    // Effect for setting remaining time based on expiry time
    useEffect(() => {
        if (requiresTwoFactor && expiryTime > 0) {
            setRemainingTime(expiryTime * 60); // Convert min to sec
            requiresTwoFactorRef.current = true; // Store the current state
        }
    }, [requiresTwoFactor, expiryTime]);

    // Effect for keeping track of remaining time
    useEffect(() => {
        remainingTimeRef.current = remainingTime; // Keep track of remaining time
    }, [remainingTime]);

    // Effect for handling countdown timer
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined; // Định nghĩa kiểu cho interval
        if (requiresTwoFactorRef.current) {
            if (remainingTimeRef.current > 0) {
                interval = setInterval(() => {
                    setRemainingTime((prevTime) => {
                        if (prevTime <= 1) {
                            setMessage({ content: 'Hết thời gian xác thực. Vui lòng đăng nhập lại.', type: 'error' });
                            setRequiresTwoFactor(false); // Quay lại màn hình đăng nhập
                            return 0; // Đặt lại thời gian
                        }
                        return prevTime - 1; // Giảm thời gian
                    });
                }, 1000);
            }

            return () => {
                clearInterval(interval); // Dọn dẹp interval khi component unmount hoặc trước khi chạy lại
            };
        }
    }, [requiresTwoFactor]); // Chỉ chạy khi requiresTwoFactor thay đổi

    const getDeviceFingerprint = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    };

    const handleTwoFactorLogin = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const deviceFingerprint = await getDeviceFingerprint();
            const twofactor: ITwoFactorLogin = {
                Email: login,
                TwoFactorCode: twoFactorCode,                
            };
            const resulTwoFactorAction = await dispatch(twoFactorLog({ twofactor, deviceFingerprint }));       
            const { tokensData } = resulTwoFactorAction.payload;                     
            if (twoFactorLog.fulfilled.match(resulTwoFactorAction)) {                                                                               
                ToastUtils.success('Xác thực thành công');    
                localStorage.setItem('AccessToken', tokensData.accessJwt)           
                setTimeout(() => {
                    navigate('/authorized_user');
                }, 1000);
                setisFactorLogin(true);
            } else {                
                // console.error('Verification failed:', resulTwoFactorAction.payload);
                ToastUtils.error('Xác nhận thất bại');
                // setMessage({ content: resulTwoFactorAction.payload, type: 'error' });
            }
        } catch (error) {
            // console.error("Error during verification:", error);
            ToastUtils.error('Đã có lỗi xảy ra');
            // setMessage({ content: 'Đã có lỗi xảy ra', type: 'error' });
        } finally {
            setIsLoading(false); // Kết thúc chờ            
        }
    };

    const log = async (): Promise<void> => {
        try {
            const deviceFingerprint = await getDeviceFingerprint();
            const authDto: IAuthDto = {
                Email: login,
                Password: password,                
            };

            setIsLoading(true);
            const resultAction = await dispatch(signIn({ authDto, deviceFingerprint })); // Chờ đợi giá trị trả về            
            if (signIn.fulfilled.match(resultAction)) {                
                const { expiryTime, requiresTwoFactor, tokensData } = resultAction.payload;                                                                            
                if (requiresTwoFactor) {
                    setRequiresTwoFactor(true);                    
                    setRemainingTime(1); // Reset timer
                    setExpiryTime(expiryTime);
                } else {                    
                    ToastUtils.success('Đăng nhập thành công');       
                    localStorage.setItem('AccessToken', tokensData.accessJwt)                                 
                    setTimeout(() => {
                        navigate('/authorized_user');
                    }, 1000);
                    setIsLoggedIn(true);
                }

            } else {                
                // console.error('Login failed:', resultAction.payload);
                ToastUtils.error('Đăng nhập thất bại');
                // setMessage({ content: resultAction.payload, type: 'error' });
            }
        } catch (error) {
            // console.error("Error during login:", error);
            ToastUtils.error('Đã có lỗi xảy ra');
            // setMessage({ content: 'Đã có lỗi xảy ra', type: 'error' });
        } finally {
            setIsLoading(false); // Đặt loading về false sau khi hoàn thành
        }
    };

    useEffect(() => {
        if (authState.isAuth) {
            navigate('/authorized_user')
        }
    }, [navigate, authState.isAuth])
    // Convert seconds to minutes and seconds for display
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <Container>
            <Content>
                <Stack alignItems="center" justifyContent="center" style={{ height: '100vh' }}>
                    <Panel header="Đăng nhập" bordered style={{ width: 400 }}>
                        {message.content && (
                            <Message
                                showIcon
                                type={
                                    message.type === 'success' || message.type === 'error'
                                        ? message.type
                                        : 'info'
                                }
                            >
                                <strong>{message.type === 'success' ? 'Thành công!' : 'Lỗi!'}</strong> {message.content}
                            </Message>
                        )}
                        {!requiresTwoFactor ? (
                            <Form fluid onSubmit={log}>
                                <Form.Group>
                                    <Form.ControlLabel>Tên đăng nhập</Form.ControlLabel>
                                    <Form.Control name="username" value={login} onChange={(value: string | number) => setLogin(value as string)} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.ControlLabel>Mật khẩu</Form.ControlLabel>
                                    <InputGroup>
                                        <Form.Control
                                            name="password"
                                            type={showPassword ? 'text' : 'password'} // Toggle password visibility
                                            value={password}
                                            onChange={(value: string | number) => setPassword(value as string)}
                                            required
                                        />
                                        <InputGroup.Button onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />} {/* Eye icon */}
                                        </InputGroup.Button>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <VStack spacing={10}>
                                        {isLoading ? (
                                            <Loader center content="Đang xử lý..." />
                                        ) : (
                                            !isLoggedIn ? (
                                                <Button appearance="primary" block type="submit">
                                                    Đăng nhập
                                                </Button>
                                            ) : (
                                                <Loader center content="Đang xử lý..." />
                                            )
                                        )}
                                    </VStack>
                                </Form.Group>
                                <Form.Group>
                                    <div className="login-links">
                                        <a href="/register">Tạo tài khoản</a>
                                        <a href="/forgot-password">Quên mật khẩu?</a>
                                    </div>
                                </Form.Group>
                            </Form>
                        ) : (
                            <Form fluid onSubmit={handleTwoFactorLogin}>
                                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
                                    Mã xác thực đã được gửi đến email của bạn
                                </p>
                                <Form.Group>
                                    <Form.ControlLabel>Mã xác thực</Form.ControlLabel>
                                    <Form.Control
                                        name="twoFactorCode"
                                        value={twoFactorCode}
                                        onChange={(value: string | number) => setTwoFactorCode(value as string)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <VStack spacing={10}>
                                        {isLoading ? (
                                            <Loader center content="Đang xử lý..." />
                                        ) : (
                                            !isFactorLogin ? (
                                                <Button appearance="primary" block type="submit">
                                                    Xác thực
                                                </Button>
                                            ) : (
                                                <Loader center content="Đang xử lý..." />
                                            )
                                        )}
                                    </VStack>
                                </Form.Group>
                                <Form.Group>
                                    <p style={{ textAlign: 'center', color: 'red' }}>
                                        Thời gian còn lại: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                                    </p>
                                </Form.Group>
                            </Form>
                        )}
                        <Divider>HOẶC</Divider>
                        <Button endIcon={<FaGoogle />} appearance="default" block>
                            Đăng nhập với Google
                        </Button>
                    </Panel>
                </Stack>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                © 2024 Đăng nhập
            </Footer>
        </Container>
    )
}

export default withNetwork(Login)
