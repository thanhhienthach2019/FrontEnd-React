import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IAuthDto } from '../../interfaces/IAuthDto'
import { WithNetworkProps } from '../../interfaces/WithNetworkProps'
import { registration } from '../../store/action-creators/AuthActionCreators'
import { authActions } from '../../store/reducers/AuthReducer'
import withNetwork from '../hocs/withNetwork'
import { Container, Content, Footer, Form, Button, Panel, InputGroup, Stack, VStack, Message, Divider, Loader } from 'rsuite';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { ToastUtils } from '../../utils/ToastUtils';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const Registration: FC<WithNetworkProps> = ({ authState, dispatch }: WithNetworkProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState({ content: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Hàm kiểm tra mật khẩu và xác nhận mật khẩu có trùng khớp
    const validatePasswordsMatch = (): boolean => {
        if (password !== confirmPassword) {
            setMessage({ content: 'Mật khẩu và xác nhận mật khẩu không trùng khớp.', type: 'error' });
            return false;
        }
        return true;
    };
    const getDeviceFingerprint = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    };
    const handleRegister = async (): Promise<void> => {
        if (!validatePasswordsMatch()) return;
        const deviceFingerprint = await getDeviceFingerprint();

        const authDto: IAuthDto = {
            Email: email,
            Password: password,
        };
        dispatch(registration({ authDto, deviceFingerprint }))
        setIsLoading(true);
        try {
            // Thực hiện logic đăng ký tại đây (gửi authDto đến API)
            // Giả sử đăng ký thành công
            ToastUtils.success('Đăng ký thành công!');
            navigate('/login'); // Chuyển đến trang đăng nhập sau khi đăng ký thành công
        } catch (error) {
            ToastUtils.error('Đã có lỗi xảy ra khi đăng ký');
        } finally {
            setIsLoading(false);
        }
    };

    // const reg = (): void => {
    //     const authDto: IAuthDto = {
    //         Email: login,
    //         Password: password,            
    //     }
    //     dispatch(registration(authDto))
    // }

    // useEffect(() => {
    //     if (authState.isAuth) {
    //         navigate('/login')
    //     }
    // }, [navigate, authState.isAuth])

    return (
        <Container>
            <Content>
                <Stack alignItems="center" justifyContent="center" style={{ height: '100vh' }}>
                    <Panel header="Đăng ký tài khoản" bordered style={{ width: 400 }}>
                        {message.content && (
                            <Message
                                showIcon
                                type={message.type === 'success' || message.type === 'error' ? message.type : 'info'}
                            >
                                <strong>{message.type === 'success' ? 'Thành công!' : 'Lỗi!'}</strong> {message.content}
                            </Message>
                        )}
                        <Form fluid onSubmit={handleRegister}>
                            <Form.Group>
                                <Form.ControlLabel>Email</Form.ControlLabel>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(value: string | number) => setEmail(value as string)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Mật khẩu</Form.ControlLabel>
                                <InputGroup>
                                    <Form.Control
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(value: string | number) => setPassword(value as string)}
                                        required
                                    />
                                    <InputGroup.Button onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </InputGroup.Button>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Xác nhận mật khẩu</Form.ControlLabel>
                                <Form.Control
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(value: string | number) => setConfirmPassword(value as string)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <VStack spacing={10}>
                                    {isLoading ? (
                                        <Loader center content="Đang xử lý..." />
                                    ) : (
                                        <Button appearance="primary" block type="submit">
                                            Đăng ký
                                        </Button>
                                    )}
                                </VStack>
                            </Form.Group>
                        </Form>
                        <Divider>HOẶC</Divider>
                        <Button appearance="default" block onClick={() => navigate('/login')}>
                            Đăng nhập
                        </Button>
                    </Panel>
                </Stack>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                © 2024 Đăng ký tài khoản
            </Footer>
        </Container>
    );
}

export default withNetwork(Registration)
